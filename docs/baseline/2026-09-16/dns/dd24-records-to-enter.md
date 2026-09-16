# tpsventilatie.nl — records to create at dd24 (mirror of cyberfolks zone, 2026-09-16)
# Already present at dd24: TXT @ google-site-verification=DvCnCNBbXd73JTab3-DsDmq_KgkQmlCZ7onK6OqDkoI
# TTL: 3600 where the panel allows (cyberfolks uses 14400)

| # | Host | Type | Value |
|---|------|------|-------|
| 1 | @ | A | 195.78.67.39 |
| 2 | www | A | 195.78.67.39 |
| 3 | mail | A | 195.78.67.39 |
| 4 | ftp | A | 195.78.67.39 |
| 5 | smtp | A | 195.78.67.39 |
| 6 | pop | A | 195.78.67.39 |
| 7 | @ | MX (prio 10) | mail.tpsventilatie.nl. |
| 8 | @ | TXT | v=spf1 a mx include:_spf.cyberfolks.pl -all |
| 9 | _dmarc | TXT | v=DMARC1; p=none; sp=none |
| 10 | x._domainkey | TXT | v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzCZ5IExAsvKFos5wZHEhDCfay5cFlFXKO3W0F1EymQr0S56nS0F3P/JLgYDc7ppOWpGHG2uEQFF4YAbrCGU55O6ktPRgfbzKdudRsd2C1rFDTU8uZHBAMTyyg76AUKpQ8jNogqUSdmn5E13GdSQHk/rC4haEkzDwC8aOohaHb1Xv15/2aJq5PLtuIYOY40+pstNPkWUJRWv1w6USE0ZXrbpd5wMYc3gZxNiSzYvMRnxmI8naP4IpU2sHs9Bj9IXWRwsi5rzJtuJDPfTPDG8xJXLOzvsWSC9t5pLkrbvqI+IuWzi63uObOdlL3gkLezgg5XoUrplax2ja3w86UH3bPwIDAQAB |
| 11 | autoconfig | CNAME | autodiscover.s161.cyberfolks.pl. |
| 12 | _autodiscover._tcp | SRV (prio 10, weight 10, port 443) | autodiscover.s161.cyberfolks.pl. |
