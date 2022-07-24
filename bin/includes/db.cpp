#include <vector>
#include <string>
#include <iostream>
#include "sqlite3.h"
#include <string.h>
#include "db.h"

sqlite3 *db;

int Database::connect_db()
{

    if (sqlite3_open("/app/uavcast/data/sql/uavcast.db", &db) != SQLITE_OK)
    {
        return -1;
    }
    else
    {
        return 0;
    }

    return -1;
}

int Database::close_db()
{

    if (sqlite3_close(db))
    {
        return -1;
    }
    else
    {
        return 0;
    }

    return -1;
}

int Database::get_global(global_values *global)
{
    if (Database::connect_db() != 0)
    {
        return -1;
    }

    int rc;
    const char *sql = "SELECT * FROM global";
    sqlite3_stmt *stmt;

    sqlite3_prepare_v2(db, sql, -1, &stmt, NULL);
    sqlite3_bind_int(stmt, 1, 16); /* 1 */

    while ((rc = sqlite3_step(stmt)) == SQLITE_ROW)
    {

        for (int col = 0; col < sqlite3_column_count(stmt); col++)
        {

            if (strcmp(sqlite3_column_name(stmt, col), "useVpn") == 0)
            {
                global->useVpn = sqlite3_column_int(stmt, col);
            }
            else if (strcmp(sqlite3_column_name(stmt, col), "useModem") == 0)
            {
                global->useModem = sqlite3_column_int(stmt, col);
            }
        }
    }

    // Close db.
    Database::close_db();

    switch (rc)
    {
    case SQLITE_DONE:
    case SQLITE_OK:
        printf("\nFetched Global values\n");
        return 0;
        break;
    case SQLITE_ERROR:
        printf("\nSQL error or missing database\n");
        return -1;
        break;
    case SQLITE_MISUSE:
        printf("\nLibrary used incorrectly\n");
        return -1;
        break;
    default:
        printf("\nError code: %i.\nPlease advise Sqlite error codes (http://www.sqlite.org/c3ref/c_abort.html)", rc);
        return -1;
    }
}

int Database::get_vpn(vpn_values *vpn)
{
    if (Database::connect_db() != 0)
    {
        return -1;
    }

    int rc;
    const char *sql = "SELECT * FROM vpn";
    sqlite3_stmt *stmt;

    sqlite3_prepare_v2(db, sql, -1, &stmt, NULL);
    sqlite3_bind_int(stmt, 1, 16); /* 1 */

    while ((rc = sqlite3_step(stmt)) == SQLITE_ROW)
    {

        // std::cout << sqlite3_column_count(stmt) << '\n';
        for (int col = 0; col < sqlite3_column_count(stmt); col++)
        {
            // std::cout << sqlite3_column_name(stmt, col) << '\n';
            if (strcmp(sqlite3_column_name(stmt, col), "enableVpn") == 0)
            {
                vpn->enableVpn = sqlite3_column_int(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "serviceProvider") == 0)
            {
                vpn->serviceProvider = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "username") == 0)
            {
                vpn->username = (char *)sqlite3_column_text(stmt, col);
            }

            if (strcmp(sqlite3_column_name(stmt, col), "password") == 0)
            {
                vpn->password = (char *)sqlite3_column_text(stmt, col);
            }
        }
    }

    Database::close_db();
    switch (rc)
    {
    case SQLITE_DONE:
    case SQLITE_OK:
        // printf("\nFetched Modem values\n");
        return 0;
        break;
    case SQLITE_ERROR:
        // printf("\nSQL error or missing database\n");
        return -1;
        break;
    case SQLITE_MISUSE:
        // printf("\nLibrary used incorrectly\n");
        return -1;
        break;
    default:
        // printf("\nError code: %i.\nPlease advise Sqlite error codes (http://www.sqlite.org/c3ref/c_abort.html)", rc);
        return -1;
    }
}

int Database::get_modem(modem_values *modem)
{
    if (Database::connect_db() != 0)
    {
        return -1;
    }

    int rc;
    const char *sql = "SELECT * FROM modem";
    sqlite3_stmt *stmt;

    sqlite3_prepare_v2(db, sql, -1, &stmt, NULL);
    sqlite3_bind_int(stmt, 1, 16); /* 1 */

    while ((rc = sqlite3_step(stmt)) == SQLITE_ROW)
    {

        // std::cout << sqlite3_column_count(stmt) << '\n';
        for (int col = 0; col < sqlite3_column_count(stmt); col++)
        {
            // std::cout << sqlite3_column_name(stmt, col) << '\n';
            if (strcmp(sqlite3_column_name(stmt, col), "enableModem") == 0)
            {
                modem->enableModem = sqlite3_column_int(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "modemInformation") == 0)
            {
                modem->modemInformation = sqlite3_column_int(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "modemInterface") == 0)
            {
                modem->modemInterface = (char *)sqlite3_column_text(stmt, col);
            }

            if (strcmp(sqlite3_column_name(stmt, col), "modemType") == 0)
            {
                modem->modemType = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "internalAddress") == 0)
            {
                modem->internalAddress = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "pinCode") == 0)
            {
                modem->pinCode = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "username") == 0)
            {
                modem->username = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "password") == 0)
            {
                modem->password = (char *)sqlite3_column_text(stmt, col);
            }
        }
    }

    Database::close_db();
    switch (rc)
    {
    case SQLITE_DONE:
    case SQLITE_OK:
        // printf("\nFetched Modem values\n");
        return 0;
        break;
    case SQLITE_ERROR:
        // printf("\nSQL error or missing database\n");
        return -1;
        break;
    case SQLITE_MISUSE:
        // printf("\nLibrary used incorrectly\n");
        return -1;
        break;
    default:
        // printf("\nError code: %i.\nPlease advise Sqlite error codes (http://www.sqlite.org/c3ref/c_abort.html)", rc);
        return -1;
    }
}
int Database::get_camera(camera_values *camera)
{
    if (Database::connect_db() != 0)
    {
        std::cout << ">>> cannot connect database!" << "\n";
        return -1;
    }

    int rc;
    const char *sql = "SELECT * FROM camera";
    sqlite3_stmt *stmt;

    sqlite3_prepare_v2(db, sql, -1, &stmt, NULL);
    sqlite3_bind_int(stmt, 1, 16); /* 1 */

    while ((rc = sqlite3_step(stmt)) == SQLITE_ROW)
    {

        // std::cout << sqlite3_column_count(stmt) << '\n';
        for (int col = 0; col < sqlite3_column_count(stmt); col++)
        {
            // std::cout << sqlite3_column_name(stmt, col) << '\n';
            if (strcmp(sqlite3_column_name(stmt, col), "name") == 0)
            {
                camera->name = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "path") == 0)
            {
                camera->path = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "enableCamera") == 0)
            {
                camera->enableCamera = sqlite3_column_int(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "protocol") == 0)
            {
                camera->protocol = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "resolution") == 0)
            {
                camera->resolution = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "customPipeline") == 0)
            {
                camera->customPipeline = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "framesPrSecond") == 0)
            {
                camera->framesPrSecond = sqlite3_column_int(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "bitratePrSecond") == 0)
            {
                camera->bitratePrSecond = sqlite3_column_int(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "contrast") == 0)
            {
                camera->contrast = (float)sqlite3_column_double(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "rotation") == 0)
            {
                camera->rotation = sqlite3_column_int(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "brightness") == 0)
            {
                camera->brightness = (float)sqlite3_column_double(stmt, col);
            }

            if (strcmp(sqlite3_column_name(stmt, col), "whiteBalance") == 0)
            {
                camera->whiteBalance = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "flipCamera") == 0)
            {
                camera->flipCamera = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "format") == 0)
            {
                camera->format = (char *)sqlite3_column_text(stmt, col);
            }
        }
    }
    Database::close_db();
    switch (rc)
    {
    case SQLITE_DONE:
    case SQLITE_OK:
        // printf("\nFetched Modem values\n");
        return 0;
        break;
    case SQLITE_ERROR:
        // printf("\nSQL error or missing database\n");
        return -1;
        break;
    case SQLITE_MISUSE:
        // printf("\nLibrary used incorrectly\n");
        return -1;
        break;
    default:
        // printf("\nError code: %i.\nPlease advise Sqlite error codes (http://www.sqlite.org/c3ref/c_abort.html)", rc);
        return -1;
    }
}

EndpointRecords Database::get_endpoints()
{
    if (Database::connect_db() != 0)
    {
        return {};
    }

    int rc;
    const char *sql = "SELECT * FROM endpoint WHERE moduleActive=1";
    sqlite3_stmt *stmt;

    sqlite3_prepare_v2(db, sql, -1, &stmt, NULL);

    sqlite3_bind_int(stmt, 1, 16); /* 1 */

    endpoint_values endP;

    EndpointRecords endpArray;

    while ((rc = sqlite3_step(stmt)) == SQLITE_ROW)
    {
        // std::cout << rc << '\n';
        // std::cout << sqlite3_data_count(stmt) << '\n';
        for (int col = 0; col < sqlite3_column_count(stmt); col++)
        {
            if (strcmp(sqlite3_column_name(stmt, col), "telemEnable") == 0)
            {
                endP.telemEnable = sqlite3_column_int(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "videoEnable") == 0)
            {
                endP.videoEnable = sqlite3_column_int(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "moduleActive") == 0)
            {
                endP.moduleActive = sqlite3_column_int(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "name") == 0)
            {
                endP.name = (char *)sqlite3_column_text(stmt, col);
            }

            if (strcmp(sqlite3_column_name(stmt, col), "endpointIPaddress") == 0)
            {
                endP.endpointIPaddress = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "telemetryPort") == 0)
            {
                endP.telemetryPort = sqlite3_column_int(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "videoPort") == 0)
            {
                endP.videoPort = sqlite3_column_int(stmt, col);
            }
        }
        // Push each row with endponints to array
        endpArray.push_back(endP);
    }
    // std::cout << endpArray.size() << '\n';
    Database::close_db();

    return endpArray;
}

FlightControllerRecords Database::get_flightcontroller()
{
    if (Database::connect_db() != 0)
    {
        return {};
    }

    int rc;
    const char *sql = "SELECT * FROM flight_controller";
    sqlite3_stmt *stmt;

    sqlite3_prepare_v2(db, sql, -1, &stmt, NULL);

    sqlite3_bind_int(stmt, 1, 16); /* 1 */

    fc_values fc_ctrl;

    FlightControllerRecords fc_record;

    while ((rc = sqlite3_step(stmt)) == SQLITE_ROW)
    {
        // std::cout << rc << '\n';
        // std::cout << sqlite3_data_count(stmt) << '\n';
        for (int col = 0; col < sqlite3_column_count(stmt); col++)
        {
            if (strcmp(sqlite3_column_name(stmt, col), "controller") == 0)
            {
                fc_ctrl.controller = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "protocol") == 0)
            {
                fc_ctrl.protocol = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "connectionType") == 0)
            {
                fc_ctrl.connectionType = (char *)sqlite3_column_text(stmt, col);
            }

            if (strcmp(sqlite3_column_name(stmt, col), "internalAddress") == 0)
            {
                fc_ctrl.internalAddress = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "baudRate") == 0)
            {
                fc_ctrl.baudRate = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "tcpPort") == 0)
            {
                fc_ctrl.tcpPort = (char *)sqlite3_column_text(stmt, col);
            }
            if (strcmp(sqlite3_column_name(stmt, col), "binFlightLog") == 0)
            {
                fc_ctrl.binFlightLog = sqlite3_column_int(stmt, col);
            }
        }
        // Push each row with endponints to array
        fc_record.push_back(fc_ctrl);
    }
    // std::cout << endpArray.size() << '\n';
    Database::close_db();

    return fc_record;
}

int Database::get_application(app_values *app)
{
    if (Database::connect_db() != 0)
    {
        std::cout << "Database not ready!" << '\n';
        return app->webPort = 80;
    }

    int rc;
    const char *sql = "SELECT * FROM application";
    sqlite3_stmt *stmt;

    sqlite3_prepare_v2(db, sql, -1, &stmt, NULL);
    sqlite3_bind_int(stmt, 1, 16); /* 1 */

    while ((rc = sqlite3_step(stmt)) == SQLITE_ROW)
    {

        // std::cout << sqlite3_column_count(stmt) << '\n';
        for (int col = 0; col < sqlite3_column_count(stmt); col++)
        {
            if (strcmp(sqlite3_column_name(stmt, col), "webPort") == 0)
            {
                // std::cout << sqlite3_column_int(stmt, col) << '\n';
                app->webPort = sqlite3_column_int(stmt, col);
            }
        }
    }
    Database::close_db();
    switch (rc)
    {
    case SQLITE_DONE:
    case SQLITE_OK:
        // printf("\nFetched Modem values\n");
        return 0;
        break;
    case SQLITE_ERROR:
        // printf("\nSQL error or missing database\n");
        return -1;
        break;
    case SQLITE_MISUSE:
        // printf("\nLibrary used incorrectly\n");
        return -1;
        break;
    default:
        // printf("\nError code: %i.\nPlease advise Sqlite error codes (http://www.sqlite.org/c3ref/c_abort.html)", rc);
        return -1;
    }
}