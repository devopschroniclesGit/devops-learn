---
title: Package Management & Storage
sidebar_label: Package Management & Storage
description: Master Linux package management with dnf and apt, and understand LVM storage management for production systems.
tags: [linux, storage, lvm, foundations, intermediate]
sidebar_position: 9
---

# Package Management & Storage

## Two skills every DevOps engineer uses daily

Package management installs and maintains the software your infrastructure runs.
Storage management determines whether that software has somewhere to write data.
Get either wrong and systems fail silently — often at the worst possible time.

---

## Package management — dnf (RHEL family)

```bash
# Update
dnf update -y                       # update all packages
dnf update nginx -y                 # update specific package
dnf check-update                    # check for updates without installing

# Install and remove
dnf install nginx -y                # install package
dnf remove nginx -y                 # remove package
dnf autoremove -y                   # remove unused dependencies

# Search and inspect
dnf search nginx                    # search available packages
dnf info nginx                      # show package details
dnf list installed                  # list installed packages
dnf list installed | grep nginx     # check if package is installed

# History
dnf history                         # show transaction history
dnf history undo 5                  # undo transaction number 5
```

---

## Package management — apt (Debian/Ubuntu)

```bash
# Always update index first
apt update                          # refresh package index
apt upgrade -y                      # upgrade all packages

# Install and remove
apt install nginx -y                # install
apt remove nginx -y                 # remove, keep config files
apt purge nginx -y                  # remove and delete config files
apt autoremove -y                   # remove unused dependencies

# Search and inspect
apt search nginx                    # search packages
apt show nginx                      # package details
dpkg -l | grep nginx                # check if installed
```

:::warning
On Ubuntu always run `apt update` before `apt install`. Without it you may
install an outdated version from a stale cache or get package not found errors.
:::

---

## Inspecting storage

```bash
lsblk                               # disk and partition layout
df -h                               # filesystem usage — how full
du -sh /var/log                     # size of a specific directory
du -sh * | sort -h                  # all items sorted by size
fdisk -l                            # detailed partition information
blkid                               # UUIDs and filesystem types
```

---

## LVM — Logical Volume Manager

LVM adds a layer between physical disks and filesystems that enables
resizing volumes without downtime.

Physical disk (/dev/sdb)
↓ pvcreate
Physical Volume (PV)
↓ vgcreate / vgextend
Volume Group (VG)
↓ lvcreate
Logical Volume (LV)
↓ mkfs
Filesystem (ext4/xfs)
↓ mount
Mount point (/data)

### Create a new LVM volume

```bash
# Step 1 — create physical volume
pvcreate /dev/sdb
pvs                                 # verify

# Step 2 — create or extend volume group
vgcreate data-vg /dev/sdb           # create new VG
vgextend existing-vg /dev/sdb       # add disk to existing VG
vgs                                 # verify

# Step 3 — create logical volume
lvcreate -L 10G -n data-lv data-vg  # 10GB volume named data-lv
lvs                                 # verify

# Step 4 — format
mkfs.xfs /dev/data-vg/data-lv       # format as XFS
mkfs.ext4 /dev/data-vg/data-lv      # format as ext4

# Step 5 — mount
mkdir /data
mount /dev/data-vg/data-lv /data
df -h                               # verify
```

### Extend an existing volume (no downtime)

```bash
# Step 1 — extend the logical volume
lvextend -L +5G /dev/data-vg/data-lv

# Step 2 — resize the filesystem
xfs_growfs /data                    # for XFS (uses mount point)
resize2fs /dev/data-vg/data-lv      # for ext4 (uses device path)

# Verify
df -h
```

### Make mount persistent

Get the UUID:

```bash
blkid /dev/data-vg/data-lv
```

Add to `/etc/fstab`:

```bash
UUID=your-uuid-here  /data  xfs  defaults  0  2
```

Test without rebooting:

```bash
umount /data
mount -a                            # mounts everything in fstab
df -h                               # verify it mounted
```

:::danger
Always test fstab changes with `mount -a` before rebooting.
A syntax error in fstab can prevent the system from booting.
If unsure, keep a second SSH session open while testing.
:::

---

## Swap management

```bash
free -h                             # show RAM and swap usage
swapon --show                       # list active swap spaces

# Create a swap file
dd if=/dev/zero of=/swapfile bs=1M count=2048   # 2GB swap file
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Add to /etc/fstab to persist
/swapfile  none  swap  sw  0  0
```

---

## Quick reference

```bash
# Package management
dnf update -y                   # update all (RHEL)
dnf install pkg -y              # install (RHEL)
apt update && apt install pkg   # update index and install (Ubuntu)
dnf history                     # transaction history

# Disk inspection
lsblk                           # disk layout
df -h                           # filesystem usage
du -sh /path                    # directory size
blkid                           # UUIDs

# LVM
pvcreate /dev/sdb               # create physical volume
vgcreate vg-name /dev/sdb       # create volume group
lvcreate -L 10G -n lv-name vg   # create logical volume
lvextend -L +5G /dev/vg/lv      # extend volume
xfs_growfs /mount               # resize XFS filesystem
resize2fs /dev/vg/lv            # resize ext4 filesystem

# Mount
mount /dev/vg/lv /data          # mount
mount -a                        # mount all from fstab
umount /data                    # unmount
```

---

## Test your knowledge

[→ Take the Package Management and Storage Quiz](./quiz-packages)
