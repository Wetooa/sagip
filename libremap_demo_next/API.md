# Get Storms

curl 'https://zoom.earth/data/storms/?date=2026-01-22T00%3A00Z&to=12' \
 --compressed \
 -H 'User-Agent: Mozilla/5.0 (X11; Linux x86*64; rv:146.0) Gecko/20100101 Firefox/146.0' \
 -H 'Accept: */\_' \
 -H 'Accept-Language: en-US,en;q=0.5' \
 -H 'Accept-Encoding: gzip, deflate, br, zstd' \
 -H 'Referer: https://zoom.earth/' \
 -H 'Sec-GPC: 1' \
 -H 'Connection: keep-alive' \
 -H 'Sec-Fetch-Dest: empty' \
 -H 'Sec-Fetch-Mode: cors' \
 -H 'Sec-Fetch-Site: same-origin' \
 -H 'Priority: u=4' \
 -H 'TE: trailers'

# Get Storm Data

curl 'https://zoom.earth/data/storms/?id={id}' \
 --compressed \
 -H 'User-Agent: Mozilla/5.0 (X11; Linux x86*64; rv:146.0) Gecko/20100101 Firefox/146.0' \
 -H 'Accept: */\_' \
 -H 'Accept-Language: en-US,en;q=0.5' \
 -H 'Accept-Encoding: gzip, deflate, br, zstd' \
 -H 'Referer: https://zoom.earth/' \
 -H 'Sec-GPC: 1' \
 -H 'Connection: keep-alive' \
 -H 'Sec-Fetch-Dest: empty' \
 -H 'Sec-Fetch-Mode: cors' \
 -H 'Sec-Fetch-Site: same-origin' \
 -H 'Priority: u=4' \
 -H 'TE: trailers'
