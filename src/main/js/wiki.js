(function($) {
	var episodes = [];

	function season(i,e) {
		$(e).find("tr.vevent").each(episodeCurrier(i + 1));
	}

	function episodeCurrier(seasonNumber) {
		return function (i,e) { 
			var $e = $(e),
				episode = [],
				cells = $e.find("td"),
				airDate;
			
			episode.push("S" + zeroPad(seasonNumber) + "E" + zeroPad(i + 1));
			episode.push($(cells[1]).text()); // title
			episode.push($(cells[2]).text()); // director
			episode.push($(cells[3]).text()); // writer
			
			episode.push(findDate($(cells[4]).text()));
			
			console.log(episode.join('*'));
		};
	}

	function findDate(cellText) {
		airDate = new Date(cellText);
		return airDate.getFullYear() + "-" + (airDate.getMonth() + 1) + "-" + airDate.getDate();
	}
	
	function zeroPad(n) {
		return n < 10 ? "0" + n : n;
	}
	
	$("table.wikitable.plainrowheaders").each(season);
	
}(jQuery));