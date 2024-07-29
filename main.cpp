#include <iostream>
#include <sqlite3.h>
#include <nlohmann/json.hpp>

int process_row(void* data, int argc, char** argv, char** azColName) {
    auto& json_rows = *reinterpret_cast<nlohmann::json*>(data);
    nlohmann::json row;
    for (int i = 0; i < argc; i++) {
        row[azColName[i]] = argv[i] ? argv[i] : nullptr;
    }
    json_rows.push_back(row);
    return 0;
}

void execute_sql(sqlite3* db, const char* sql, nlohmann::json& json_rows) {
    char* err_msg = nullptr;
    int rc = sqlite3_exec(db, sql, process_row, &json_rows, &err_msg);
    if (rc != SQLITE_OK) {
        std::cerr << "SQL error: " << err_msg << std::endl;
        sqlite3_free(err_msg);
    }
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage: " << argv[0] << " <table_name>" << std::endl;
        return 1;
    }

    const char* table_name = argv[1];
    std::string sql_query = "SELECT * FROM " + std::string(table_name) + ";";

    sqlite3* db = nullptr;
    const char* db_path = "/home/edson/apps/activity2.db";
    if (sqlite3_open(db_path, &db) != SQLITE_OK) {
        std::cerr << "Can't open database: " << sqlite3_errmsg(db) << std::endl;
        return 1;
    }

    nlohmann::json json_rows;
    execute_sql(db, sql_query.c_str(), json_rows);
    sqlite3_close(db);

    std::cout << json_rows.dump(4) << std::endl;
    return 0;
}