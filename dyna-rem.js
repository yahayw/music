$(function(){	
    let pageWidth = document.documentElement.clientWidth;	
    let style = $('<style></style>');    
    let rootFZ = parseInt(pageWidth/16);
    style.html(`html {font-size:${rootFZ}px;}`);
    $('head').append(style);
})