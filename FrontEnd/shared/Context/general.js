function formatDateTime(strValue) {
    if (!strValue) {
        return '';
    }
    else {
        var d = new Date(strValue);
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = (day >= 10 ? '' : '0') + day + '/' +
            (('' + month).length < 2 ? '0' : '') + month + '/' +
            d.getFullYear();
        if (output === '01/01/1')
            return '';
        return output;
    }
}

function formatNumber(number) {    
    let nf = new Intl.NumberFormat('en-US');
    return nf.format(number);     
}


export { formatNumber, formatDateTime };