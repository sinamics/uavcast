# uavcast - companion software for remote vehicles

After several toughts and discussions with myself i finally came to the conclusion of publishing the whole uavcast 5.x dev build publically as open source in hopes that community will make this project become better and more advanced.

uavcast 5.x has been re-written from the ground-up compared to the previouse versions, and are still missing key features before it is usable.

Run devbuld.sh

## Codebase

- [x] Backend nodejs (Typescript)
- [x] Frontend React (Typescript)
- [x] sqlite3 database
- [x] graphql && codegen
- [x] type-graphql

## Usage

Add backend/.env

```js
SQLITE_DATABASE = '/home/uavcast/persistent/uavcast.db';
```

Add frontend/.env

```js
REACT_APP_UAVCAST_VER = '5.0.0-rc9';
```
