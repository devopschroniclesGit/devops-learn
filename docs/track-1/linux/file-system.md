---
title: File System & Navigation
sidebar_label: File System & Navigation
description: Understand the Linux filesystem hierarchy, navigate directories confidently, and use essential file management commands.
tags: [linux, foundations, beginner]
sidebar_position: 1
---

# File System & Navigation

## The filesystem is not a folder — it is a tree

Every file, device, and process in Linux lives under a single root. There is no
`C:\` drive, no `D:\` drive. One tree, one root, everything branching downward.

/                        ← root — top of everything
├── etc/                 ← system configuration files
├── home/                ← user home directories
│   └── sikhumbuzok/     ← your home directory
├── var/                 ← logs, application data, spools
│   └── log/             ← system and application logs
├── bin/                 ← essential system binaries
├── usr/
│   └── bin/             ← user-installed binaries
├── tmp/                 ← temporary files, cleared on reboot
├── proc/                ← virtual filesystem — kernel and process info
└── dev/                 ← device files — disks, terminals, etc

Understanding this layout is not optional. When a service fails, you look in
`/var/log`. When you need to edit a config, you go to `/etc`. When you need to
find a binary, it is in `/bin` or `/usr/bin`. The tree tells you where everything
lives.

---

## Key directories and what they contain

| Directory | Contains | Example |
|---|---|---|
| `/etc` | System config files | `/etc/ssh/sshd_config` |
| `/var/log` | Log files | `/var/log/nginx/access.log` |
| `/home` | User home directories | `/home/sikhumbuzok` |
| `/bin` | Essential binaries | `ls`, `cp`, `mv`, `cat` |
| `/usr/bin` | User binaries | `git`, `vim`, `python3` |
| `/tmp` | Temporary files | Cleared on every reboot |
| `/proc` | Virtual kernel data | `/proc/cpuinfo`, `/proc/meminfo` |
| `/dev` | Device files | `/dev/sda` (first disk) |

---

## Navigation commands

### Where am I?

```bash
pwd
# /home/sikhumbuzok/devopschronicles
```

`pwd` — Print Working Directory. Run this any time you are not sure where you are.

### What is here?

```bash
ls          # basic listing
ls -l       # long format — permissions, owner, size, date
ls -a       # show hidden files (files starting with .)
ls -lh      # long format with human-readable sizes
ls -lt      # sort by modification time, newest first
ls -la      # long format including hidden files
```

### Moving around

```bash
cd /etc               # go to an absolute path
cd documents          # go to a relative path
cd ..                 # go up one level to parent
cd ~                  # go to your home directory
cd -                  # go back to previous directory
```

**Absolute vs relative paths:**

```bash
# Absolute — starts with /
# Works from anywhere on the system
cd /home/sikhumbuzok/projects

# Relative — starts from where you are now
# Only works if you are in the right place
cd projects/devops
```

---

## File management commands

### Create

```bash
touch notes.txt           # create empty file
mkdir projects            # create directory
mkdir -p a/b/c            # create nested directories in one command
```

### Copy

```bash
cp file.txt backup.txt           # copy file
cp -r /source /destination       # copy directory recursively
```

### Move and rename

```bash
mv oldname.txt newname.txt       # rename file
mv file.txt /tmp/                # move file to /tmp
```

### Delete

```bash
rm file.txt              # delete file
rm -r directory/         # delete directory and contents
rm -rf directory/        # force delete — no confirmation
```

:::danger
`rm -rf` has no undo. There is no Recycle Bin in Linux. Once deleted, files
are gone. Always double-check the path before running it.
:::

### View file contents

```bash
cat file.txt             # print entire file
less file.txt            # scroll through file (q to quit)
head -20 file.txt        # first 20 lines
tail -20 file.txt        # last 20 lines
tail -f /var/log/syslog  # follow file live — essential for logs
```

---

## Finding things

### Find files by name

```bash
find /etc -name "*.conf"          # all .conf files under /etc
find /home -name "*.md" -type f   # markdown files only
find / -name "nginx.conf" 2>/dev/null   # search everywhere, suppress errors
```

### Find text inside files

```bash
grep "error" /var/log/syslog           # find lines containing "error"
grep -r "database" /etc/               # search recursively in /etc
grep -i "failed" /var/log/auth.log     # case-insensitive search
```

---

## Disk usage

```bash
df -h              # filesystem usage — how full each partition is
du -sh *           # size of each item in current directory
du -sh /var/log    # size of a specific directory
```

:::info Production habit
Run `df -h` every time you SSH into a production server before doing anything
else. A full disk is one of the most common causes of service failures — and
it is silent until something breaks.
:::

---

## Symbols you will see constantly

| Symbol | Meaning |
|---|---|
| `/` | Root directory or path separator |
| `~` | Home directory of current user |
| `.` | Current directory |
| `..` | Parent directory |
| `*` | Wildcard — matches anything |
| `?` | Wildcard — matches one character |

---

## Quick reference card

```bash
pwd                  # where am I
ls -lah              # what is here (all files, human sizes)
cd /path/to/dir      # go somewhere
cd ..                # go up
cd ~                 # go home
mkdir -p dir/sub     # create nested directories
touch file.txt       # create empty file
cp -r src/ dst/      # copy directory
mv old new           # rename or move
rm -rf dir/          # delete directory
cat file             # view file
tail -f file         # follow file live
find /path -name     # find by name
grep -r "text" /     # find text in files
df -h                # disk space
du -sh *             # directory sizes
```

---

## Test your knowledge

Head to the quiz for this section and work through all 20 questions. The quiz
shuffles randomly so each attempt is different.

[→ Take the File System Quiz](./quiz-file-system)
