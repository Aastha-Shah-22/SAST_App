# Public repository
./scan-repo.sh -r https://github.com/user/repo.git -s YOUR_SEMGREP_TOKEN

# Private repository
./scan-repo.sh \
  -r https://github.com/user/private-repo.git \
  -u your-username \
  -t your-token \
  -s YOUR_SEMGREP_TOKEN

# Specify branch
./scan-repo.sh \
  -r https://github.com/user/repo.git \
  -s YOUR_SEMGREP_TOKEN \
  -b develop \
  -o /path/to/reports