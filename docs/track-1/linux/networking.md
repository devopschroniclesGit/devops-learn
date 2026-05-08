---
title: Networking Commands
sidebar_label: Networking Commands
description: Master Linux networking commands for diagnosing connectivity issues, inspecting open ports, and understanding network configuration.
tags: [linux, networking, foundations, beginner]
sidebar_position: 5
---

# Networking Commands

## Networking failures are silent until they are catastrophic

A misconfigured interface, a missing route, a port bound to the wrong address —
none of these produce obvious errors until something stops working. The engineers
who diagnose network issues fast are the ones who run these commands habitually,
not just during incidents.

---

## Inspect interfaces and addresses

```bash
ip a                        # show all interfaces and IP addresses
ip a show eth0              # show specific interface
ip link show                # show interface state (up/down)
```

What you are looking for:

```

2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP>
inet 10.0.2.15/24 brd 10.0.2.255 scope global dynamic enp0s3

3: enp0s8: <BROADCAST,MULTICAST,UP,LOWER_UP>
inet 192.168.56.11/24 brd 192.168.56.255 scope global noprefixroute enp0s8

```

Key things to read:
- `UP` — interface is active
- `inet` — IPv4 address
- `/24` — subnet mask in CIDR notation
- `dynamic` — assigned by DHCP

---

## Check open ports

```bash
ss -tulnp                   # all listening ports with process names
ss -tulnp | grep 3306       # check if MySQL is listening
ss -tn                      # established TCP connections
```

:::info Production habit
Run `ss -tulnp` on every new server before deploying anything.
Know exactly what is listening before you open firewall rules.
If you see a port open that you did not configure — investigate immediately.
:::

---

## Test connectivity

```bash
# Basic reachability
ping 8.8.8.8                # test internet connectivity
ping 192.168.56.11          # test internal node connectivity
ping -c 4 hostname          # send exactly 4 packets

# Trace the path
traceroute 8.8.8.8          # show each hop to destination
tracepath 8.8.8.8           # alternative, no root required

# Test a specific port
nc -zv 192.168.56.11 5432   # test if PostgreSQL port is reachable
nc -zv hostname 22          # test if SSH is reachable
```

**Connection refused vs timeout:**

| Error | Meaning |
|---|---|
| Connection refused | Host is reachable but nothing is listening on that port |
| Connection timed out | Host is unreachable — check routing and firewall |
| No route to host | Routing table has no path to destination |

---

## DNS resolution

```bash
dig devopschronicles.com            # full DNS lookup
dig devopschronicles.com A          # A records only
dig devopschronicles.com MX         # mail records
dig @8.8.8.8 devopschronicles.com   # query specific DNS server
nslookup devopschronicles.com       # simpler alternative

cat /etc/resolv.conf                # see which DNS servers are configured
```

---

## Routing

```bash
ip route                    # show routing table
ip route show default       # show default gateway only
```

Example routing table:
default via 10.0.2.2 dev enp0s3
10.0.2.0/24 dev enp0s3 proto kernel
192.168.56.0/24 dev enp0s8 proto kernel

Reading this:
- Traffic to anything not matching a specific route → goes to `10.0.2.2` (default gateway)
- Traffic to `10.0.2.0/24` → goes out `enp0s3` (NAT interface)
- Traffic to `192.168.56.0/24` → goes out `enp0s8` (host-only interface)

---

## Download and HTTP testing

```bash
curl -I https://devopschronicles.com    # HTTP headers only
curl -o file.tar.gz https://url         # download to file
curl -v https://url                     # verbose — shows full request/response
wget https://url/file.tar.gz            # download file
wget -c https://url/file.tar.gz         # resume interrupted download
```

---

## Common ports to memorise

| Port | Service |
|---|---|
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |
| 3306 | MySQL |
| 5432 | PostgreSQL |
| 6379 | Redis |
| 27017 | MongoDB |
| 9090 | Prometheus |
| 3000 | Grafana |
| 8080 | Common app port |

---

## Network configuration files

| File | Purpose |
|---|---|
| `/etc/hosts` | Local hostname to IP mapping |
| `/etc/resolv.conf` | DNS server configuration |
| `/etc/hostname` | System hostname |
| `/etc/NetworkManager/` | NetworkManager config (RHEL/Fedora) |
| `/etc/netplan/` | Netplan config (Ubuntu 18+) |

---

## Quick reference

```bash
ip a                         # interfaces and IPs
ip route                     # routing table
ss -tulnp                    # listening ports and processes
ping host                    # basic connectivity test
traceroute host              # path to destination
nc -zv host port             # test specific port
dig domain                   # DNS lookup
curl -I https://url          # HTTP headers
cat /etc/resolv.conf         # DNS servers
cat /etc/hosts               # local hostname mappings
hostname                     # current hostname
```

---

## Test your knowledge

[→ Take the Networking Quiz](./quiz-networking)
