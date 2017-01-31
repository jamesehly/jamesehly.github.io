(function ($) {

    var po = {};

    function loadPageObjects() {
        $("[id]").each(function () {
            var id = $(this).attr('id');
            if (!id)
                return;

            po[id] = $(this);
            
            var dataType = po[id].attr('data-type');
            
            if(dataType === 'partial') {
                po[id].isPartial = true;
                po[id].partialFilePath = po[id].attr('data-file');
            }
        })
    }

    function loadPartials() {
        for(var n in po) {
            var obj = po[n];
            if(!obj.isPartial || !obj.partialFilePath)
                continue;
            obj.css({ opacity: 0 });
            obj.load(obj.partialFilePath, function() {
                $(this).animate({ opacity: 1 }, 500);
            });
        }
    } 

    $(function() {
        loadPageObjects();
        loadPartials();
        po.page.animate({ "opacity": 1 }, 500);
    });

})(jQuery);



