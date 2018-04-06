$(function(){
	let pageWidth = document.documentElement.clientWidth;	
    let style = $('<style></style>');    
    style.html(`html {font-size:${pageWidth/16}px;}`);
    $('head').append(style);
})
