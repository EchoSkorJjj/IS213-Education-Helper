#### Installing Make on Ubuntu
##### 1. Update apt Database
```
$ sudo apt update
```

##### 2. Install Make
```
$ sudo apt -y install make
```

##### 3. Test Make installation
```
$ make -version
```

#### Installing Make on Windows
`Make` is a little bit of a hassle to install on Windows, but is definitely worth it.

##### 1. Run Powershell as an administrator
Windows Search > Windows Powershell > Right Click > Run as Administrator

##### 2. Check output of `Get-ExecutionPolicy`
If `Get-ExecutionPolicy` returns `Restricted`, run the following command.
```
$ Set-ExecutionPolicy AllSigned
```
If it is already unrestricted, then you can skip this step.

##### 3. Install `chocolatey`
```
$ Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

##### 4. Install `Make`
```
$ choco install make
```

##### 5. Test Make installation
```
$ make -version
```

##### 6. Reset Execution Policy
```
$ Set-ExecutionPolicy Restricted
```