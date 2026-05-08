---
title: Users, Permissions & Processes
sidebar_label: Users, Permissions & Processes
description: Understand Linux file permissions, user management, and process control — the foundation of secure system administration.
tags: [linux, foundations, beginner]
sidebar_position: 3
---

# Users, Permissions & Processes

## Everything in Linux is owned by someone

Every file, directory, and process has an owner and a group. Permissions define
what the owner, the group, and everyone else can do with it. Get this wrong and
you either lock legitimate users out or expose sensitive data to everyone.

---

## The permission string

Run `ls -l` and you see something like:

```bash
-rwxr-xr-- 1 sikhumbuzok devops 4096 Apr 28 10:00 deploy.sh
```

Break it down:
rwx r-x r--
│ │   │   └── Others  — r-- = read only
│ │   └────── Group   — r-x = read + execute
│ └────────── Owner   — rwx = read + write + execute
└──────────── File type — - = file, d = directory, l = symlink

Each permission has a numeric value:

| Permission | Symbol | Value |
|---|---|---|
| Read | r | 4 |
| Write | w | 2 |
| Execute | x | 1 |
| None | - | 0 |

Add the values for each group to get the octal:
rwx = 4+2+1 = 7
r-x = 4+0+1 = 5
r-- = 4+0+0 = 4
Result: 754
---

## Common permission values

| Octal | Symbolic | Typical use |
|---|---|---|
| 777 | rwxrwxrwx | Never use — everyone has full access |
| 755 | rwxr-xr-x | Scripts, directories |
| 644 | rw-r--r-- | Regular files |
| 600 | rw------- | SSH private keys |
| 700 | rwx------ | Private directories |

:::danger
Never use 777 in production. It gives write and execute access to everyone on
the system. If a file is 777 and an attacker gets any user on your system,
they can modify and execute that file.
:::

---

## Changing permissions and ownership

```bash
# Symbolic mode
chmod u+x script.sh        # add execute for owner
chmod g-w file.txt         # remove write from group
chmod o+r file.txt         # add read for others
chmod a+x script.sh        # add execute for all

# Numeric mode
chmod 755 script.sh        # rwxr-xr-x
chmod 644 config.txt       # rw-r--r--
chmod 600 ~/.ssh/id_rsa    # rw------- (required for SSH keys)
chmod -R 755 /var/www/     # recursive — apply to all files inside

# Change owner
chown sikhumbuzok file.txt           # change owner
chown sikhumbuzok:devops file.txt    # change owner and group
chown -R sikhumbuzok:devops /app/    # recursive
```

---

## User management

```bash
# Create user
useradd devops                        # create user
useradd -m -s /bin/bash devops        # with home dir and bash shell
passwd devops                         # set password

# Modify user
usermod -aG wheel devops              # add to wheel group (sudo access)
usermod -aG docker devops             # add to docker group

# Delete user
userdel devops                        # delete user
userdel -r devops                     # delete user and home directory

# Switch user
su - devops                           # switch to devops user
sudo -i                               # switch to root shell
```

### Key files

| File | Contains |
|---|---|
| `/etc/passwd` | Username, UID, GID, home dir, shell |
| `/etc/shadow` | Hashed passwords — root only |
| `/etc/group` | Group definitions and memberships |
| `/etc/sudoers` | Sudo permission rules — edit with `visudo` |

:::warning
Always use `visudo` to edit `/etc/sudoers`. It validates syntax before saving.
A syntax error in sudoers locks everyone out of sudo — including you.
:::

---

## Process management

Every running program is a process with a unique PID (Process ID).

```bash
# View processes
ps aux                    # all processes, all users
ps aux | grep nginx       # find specific process
pgrep nginx               # get PID by name
top                       # real-time view sorted by CPU
htop                      # better real-time view

# Kill processes
kill PID                  # send SIGTERM — graceful shutdown
kill -9 PID               # send SIGKILL — force terminate
killall nginx             # kill all processes named nginx
pkill -f "python app.py"  # kill by command pattern
```

### Signal types

| Signal | Number | Meaning |
|---|---|---|
| SIGTERM | 15 | Please shut down gracefully |
| SIGKILL | 9 | Terminate immediately — cannot be caught |
| SIGHUP | 1 | Reload configuration |
| SIGINT | 2 | Interrupt (same as Ctrl+C) |

Always try SIGTERM first. Only use SIGKILL if the process does not respond.

---

## Background processes

```bash
./script.sh &             # run in background
nohup ./script.sh &       # run in background, survives logout
jobs                      # list background jobs
fg %1                     # bring job 1 to foreground
bg %1                     # send job 1 to background
Ctrl+Z                    # suspend current process
```

`nohup` is essential when running long processes over SSH. Without it, the
process dies when you log out.

---

## Quick reference

```bash
ls -l                    # view permissions
chmod 755 file           # set permissions numerically
chmod u+x file           # set permissions symbolically
chown user:group file    # change owner and group
useradd -m user          # create user with home dir
usermod -aG group user   # add user to group
passwd user              # set password
ps aux                   # all running processes
pgrep process_name       # get PID
kill PID                 # graceful stop
kill -9 PID              # force stop
nohup command &          # run after logout
```

---

## Test your knowledge

[→ Take the Permissions & Processes Quiz](./quiz-permissions)
