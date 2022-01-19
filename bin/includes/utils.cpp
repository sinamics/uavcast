#include <dirent.h>
#include <string>
#include <stdlib.h>
#include <stdio.h>
#include <bits/stdc++.h>
#include <sys/stat.h>
#include "utils.h"

int Utils::getProcIdByName(std::string procName)
{
    int pid = -1;

    // Open the /proc directory
    DIR *dp = opendir("/proc");
    if (dp != NULL)
    {
        // Enumerate all entries in directory until process found
        struct dirent *dirp;
        while (pid < 0 && (dirp = readdir(dp)))
        {
            // Skip non-numeric entries
            int id = atoi(dirp->d_name);
            if (id > 0)
            {
                // Read contents of virtual /proc/{pid}/cmdline file
                std::string cmdPath = std::string("/proc/") + dirp->d_name + "/cmdline";
                std::ifstream cmdFile(cmdPath.c_str());
                std::string cmdLine;
                std::getline(cmdFile, cmdLine);
                if (!cmdLine.empty())
                {
                    // Keep first cmdline item which contains the program path
                    size_t pos = cmdLine.find('\0');
                    if (pos != std::string::npos)
                        cmdLine = cmdLine.substr(0, pos);
                    // Keep program name only, removing the path
                    pos = cmdLine.rfind('/');
                    if (pos != std::string::npos)
                        cmdLine = cmdLine.substr(pos + 1);
                    // Compare against requested process name
                    if (procName == cmdLine)
                        pid = id;
                }
            }
        }
    }

    closedir(dp);

    return pid;
}
// Function that returns true if the word is found
bool Utils::isWordPresent(std::string sentence, std::string word)
{
    // To break the sentence in words
    std::stringstream s(sentence);

    // To temporarily store each individual word
    std::string temp;

    while (s >> temp)
    {

        // Comparing the current word
        // with the word to be searched
        if (temp.compare(word) == 0)
        {
            return true;
        }
    }
    return false;
}

// Returns output to console
std::string Utils::exec(const char *cmd)
{
    char buffer[128];
    std::string result = "";
    FILE *pipe = popen(cmd, "r");
    if (!pipe)
        throw std::runtime_error("popen() failed!");
    try
    {
        while (fgets(buffer, sizeof buffer, pipe) != NULL)
        {
            result += buffer;
        }
    }
    catch (...)
    {
        pclose(pipe);
        throw;
    }
    pclose(pipe);
    return result;
}

// Does not output to console in some situations.
std::string Utils::exec_p(const char *cmd)
{
   FILE* fp;
    char* result = NULL;
    size_t len = 0;

    fflush(NULL);
    fp = popen(cmd, "r");
    if (fp == NULL) {
        printf("Cannot execute command:\n%s\n", cmd);
        throw std::runtime_error("command failed!");
    }

    while(getline(&result, &len, fp) != -1) {
        fputs(result, stdout);
    }

    free(result);
    fflush(fp);
    if (pclose(fp) != 0) {
        perror("Cannot close stream.\n");
    }
    return result;
}
bool Utils::to_bool(std::string const &s)
{
    return s != "0";
}

bool Utils::file_exsist(const std::string &name)
{
    struct stat buffer;
    return (stat(name.c_str(), &buffer) == 0);
}

std::vector<std::string> Utils::split(const std::string str, char delim)
{
    std::vector<std::string> result;
    std::istringstream ss{str};
    std::string token;
    while (std::getline(ss, token, delim))
    {
        if (!token.empty())
        {
            result.push_back(token);
        }
    }
    return result;
}