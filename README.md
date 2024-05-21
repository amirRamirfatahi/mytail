# Mytail

Mytail is a Nodejs server for monitoring and retrieving host logs.

## Installation

Install [Docker](https://docs.docker.com/get-docker/).

## Running

```bash
cd $PROJECT_DIRECTORY
cp example.env .env
docker compose up -d
```

## Usage

You can use Mytail by sending a GET request to its root url.
You can also pass the following query parameters:

- file: file name to get logs from in /var/log. Default: Syslog
- keyword: text/keyword to filter the result by.
- lines: number of lines to retrieve. Default 100.

```
curl 'http://localhost:3000/?lines=100&file=syslog&key=state'
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
