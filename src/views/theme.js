import { createMuiTheme } from '@material-ui/core/styles';
export default createMuiTheme({
    typography: {
        useNextVariants: true
    },
    palette:
        {"common":
                {"black":"#000","white":"#fff"},
            "background":
                {"paper":"rgb(65,65,66)","default":"#3e3e42"},
            "primary":
                {"light":"#d9555f","main":"#d93f49","dark":"#9f262c","contrastText":"#fff"},
            "secondary":
                {"light":"#3f51b5","main":"#3f51b5","dark":"#253eb5","contrastText":"#fff"},
            "error":
                {"light":"#e57373","main":"#f44336","dark":"#d32f2f","contrastText":"#fff"},
            "text":
                {"primary":"rgba(255,255,255,0.87)","secondary":"rgba(255,255,255,0.54)","disabled":"rgba(255,255,255,0.38)","hint":"rgba(255,255,255,0.38)"}}
});
