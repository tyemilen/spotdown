# Spotdown

```
spotdown
        playlist PLAYLIST_ID SAVE_DIRECTORY
        --- Download playlist

        pl2txt PLAYLIST_ID
        --- Get playlist tracks and save them to text file

        playlistfromtext FILE_PATH SAVE_DIRECTORY
        --- Download playlist from text file
```

# How to get youtube auth info

in devtools type
```js
{ cookie: document.cookie, auth: yt.config_.ID_TOKEN }
```
and paste output to `yt.json` file