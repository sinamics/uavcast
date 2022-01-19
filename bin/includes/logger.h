#pragma once

#define LOG(x) std::cout << x << std::endl;

class Logger
{
public:
    enum Level {LevelError, LevelWarning, LevelInfo, LevelPlain};
private: 
    Level m_loglevel = LevelPlain;
public:
    void SetLevel(Level level);
    void Plain(const char* message);
    void Info(const char* message);
    void Warn(const char* message);
    void Error(const char* message);
};
