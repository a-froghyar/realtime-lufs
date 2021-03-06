# realtime-lufs

Real-time LUFS Loudness meter based on the [BS.1770-4](https://www.itu.int/dms_pubrec/itu-r/rec/bs/R-REC-BS.1770-4-201510-I!!PDF-E.pdf) recommendation from the International Telecommunication Union, using a ring buffer for the real-time calculation.  

The project is hosted on GitHub Pages and can be accessed on [lufs.froghyar.com](https://lufs.froghyar.com).

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### References
Some inspiration for this project came from Sebastian Zimmer's offline implementation of the calculation - [LoudEv](https://github.com/SebastianZimmer/LoudEv)
