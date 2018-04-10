$(function(){
    $(".list-cover .icon-area>svg").each(function(index){
    	$this = $(this);
    	$this.bind("click",function(){
	    	$this.toggleClass("active");
	    	$this.siblings().toggleClass("active");
    	})
    })

    $.get("./songs.json").then(function(response){
		let items = response; 
		let $ulCt = $('ul.list-ct');	
		initSongList(items,$ulCt,10);
	})

    function initSongList(response,$ulCt,songNum){
		let items = []
		for(let i=0;i<songNum;i++){
			items.push(response[i]);
		}
		items.forEach(function(item,index){
			let {name,id,singer} = item;
			let $li =`
			<li>
			    <span class="order">${index+1}</span>
				<a href="song.html?id=${id}" class="skip">
					<h3>${name}</h3>
					<p>
						<svg>
							<use xlink:href="#icon-highquality"></use>
						</svg>
					    ${singer}
				    </p>
					<a href="#" class="play">
						<svg>
						    <use xlink:href="#icon-play"></use>						
						</svg>
					</a>
				</a>				
		    </li>
			`;
			$ulCt.append($li);
		})		
	}
})
