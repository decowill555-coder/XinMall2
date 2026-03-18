@echo off
setlocal enabledelayedexpansion

:: Set Java 21 environment
set "JAVA_HOME=C:\Program Files\Java\jdk-21"
set "PATH=%JAVA_HOME%\bin;%PATH%"

:: Verify Java
echo Using Java from: %JAVA_HOME%
java -version

:: Run Maven with the task
cd /d "C:\Users\willdc\Documents\WorkPlace\XinMall\XinMall2\BE\XinMall"

if "%1"=="compile" (
    echo Compiling project...
    C:\apps\apache-maven-3.9.12\bin\mvn.cmd clean compile -DskipTests
) else if "%1"=="run" (
    echo Starting Spring Boot...
    C:\apps\apache-maven-3.9.12\bin\mvn.cmd spring-boot:run -DskipTests
) else (
    echo Usage: %0 compile^|run
    exit /b 1
)

endlocal
