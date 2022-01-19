#include <iostream>
#include <string.h>
#include "logger.h"

void Logger::Plain (const char* message) {
    if(m_loglevel >= LevelPlain)
        LOG(message);
}

void Logger::Info (const char* message) {
    if(m_loglevel >= LevelInfo)
        LOG("[INFO]: " << message);
}

void Logger::Warn (const char* message) {
    if(m_loglevel >= LevelWarning)
        LOG("[WARNING]: " << message);
}

void Logger::Error (const char* message) {
    if(m_loglevel >= LevelError)
        LOG("[Error]: " << message);
}
