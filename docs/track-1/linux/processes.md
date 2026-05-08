---
title: Processes & Services
sidebar_label: Processes & Services
description: Understand Linux process management and systemd service control — the foundation of operating production systems.
tags: [linux, systemd, foundations, beginner]
sidebar_position: 7
---

# Processes & Services

## If you cannot control processes, you cannot operate systems

Every running program is a process. Every production service is managed by
systemd. Understanding how to inspect, control, and troubleshoot both is
non-negotiable for any DevOps engineer.

---

## systemd — the service manager

systemd is the init system on all modern Linux distributions. It manages
services, handles dependencies between them, and collects their logs.

```bash
# Service control
systemctl start nginx           # start service
systemctl stop nginx            # stop service
systemctl restart nginx         # stop then start
systemctl reload nginx          # reload config without restart
systemctl enable --now nginx    # enable on boot and start now
systemctl disable --now nginx   # disable from boot and stop now
systemctl status nginx          # show status and recent logs
```

### Checking system health

```bash
systemctl --failed              # list all failed services
systemctl list-units --type=service --state=running   # all running services
```

:::info
Run `systemctl --failed` every time you SSH into a server.
It tells you immediately if anything has crashed since the last boot.
:::

---

## Writing a custom service unit file

Unit files live in `/etc/systemd/system/`. This is the structure:

```ini title="/etc/systemd/system/myapp.service"
[Unit]
Description=My DevOps Application
After=network.target
Requires=postgresql.service

[Service]
Type=simple
User=appuser
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/node /opt/myapp/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

After creating or modifying a unit file:

```bash
systemctl daemon-reload         # reload systemd to pick up changes
systemctl enable --now myapp    # enable and start
systemctl status myapp          # verify it is running
```

### Key directives explained

| Directive | Purpose |
|---|---|
| `After=` | Start after this unit |
| `Requires=` | Hard dependency — fail if dependency fails |
| `Wants=` | Soft dependency — start even if dependency fails |
| `Restart=always` | Restart on any exit |
| `RestartSec=5` | Wait 5 seconds before restarting |
| `User=` | Run as this user |
| `Environment=` | Set environment variables |
| `WantedBy=multi-user.target` | Enable in normal multi-user mode |

---

## Viewing logs with journalctl

```bash
journalctl -u nginx             # all logs for nginx
journalctl -u nginx -f          # follow nginx logs live
journalctl -u nginx --since "1 hour ago"   # last hour only
journalctl -b                   # all logs since last boot
journalctl -b -1                # logs from previous boot
journalctl -p err               # error level and above only
journalctl --disk-usage         # how much space logs are using
```

---

## Process management

```bash
ps aux                          # all running processes
ps aux | grep nginx             # find specific process
pgrep nginx                     # get PID by name
pstree -p                       # process tree with PIDs
top                             # real-time sorted by CPU
htop                            # better real-time view
lsof -i :8080                   # what is using port 8080
```

### Killing processes

```bash
kill PID                        # SIGTERM — graceful shutdown
kill -9 PID                     # SIGKILL — force terminate
killall nginx                   # kill all processes named nginx
pkill -f "node server.js"       # kill by command pattern
```

Always try SIGTERM first. Give the process a few seconds to
clean up. Only use SIGKILL if it does not respond.

---

## Background processes

```bash
command &                       # run in background
nohup command &                 # survive logout
jobs                            # list background jobs
fg %1                           # bring job 1 to foreground
Ctrl+Z                          # suspend current process
bg %1                           # resume suspended job in background
```

### tmux — the production way

For long-running tasks over SSH, use tmux instead of nohup:

```bash
tmux new -s deploy              # new session named deploy
# run your command
Ctrl+B then D                   # detach — session keeps running
tmux attach -t deploy           # reattach later
tmux ls                         # list sessions
```

---

## Process priority

```bash
nice -n 10 command              # start with lower priority
renice 10 -p PID                # change running process priority
```

Nice values range from -20 (highest priority) to 19 (lowest).
Default is 0. Use positive nice values for background tasks that
should not compete with production processes.

---

## Quick reference

```bash
systemctl status service        # service status
systemctl enable --now service  # enable and start
systemctl disable --now service # disable and stop
systemctl --failed              # list failed services
systemctl daemon-reload         # reload after unit file changes
journalctl -u service -f        # follow service logs
journalctl -b                   # logs since boot
ps aux | grep process           # find process
pgrep process                   # get PID
kill PID                        # graceful stop
kill -9 PID                     # force stop
lsof -i :port                   # what is on this port
nohup command &                 # run after logout
tmux new -s name                # new terminal session
```

---

## Test your knowledge

[→ Take the Processes and Services Quiz](./quiz-processes)
