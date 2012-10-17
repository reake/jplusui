﻿
document.write('<script src="' + Demo.Configs.rootUrl + Demo.Configs.dplListFilePath + '" type="text/javascript"></script>');

Demo.DplList = {

    addDpl: function (parentNode, key) {
        parentNode.innerHTML = '<form action="' + Demo.Configs.rootUrl + Demo.Configs.apiPath + 'dplmanager.njs" method="GET"><input type="hidden" name="postback" value=""><input type="text" name="category" class="x-textbox textbox-category" placeholder="组件分类"> <input type="text" name="name" class="x-textbox textbox-name" placeholder="组件名"> <input type="text" name="title" class="x-textbox textbox-name" placeholder="(可选)组件标题"><input type="hidden" name="action" value="create"><input type="hidden" name="module" value="' + key + '"> <input type="button" class="x-button x-button-info" value="添加并转到" onclick="Demo.DplList.submitForm(this.parentNode, true)"> <input type="button" class="x-button" value="添加" onclick="Demo.DplList.submitForm(this.parentNode, false)"></form>';
        
        var form = Dom.get(parentNode);

        var suggest = new Suggest(form.find('[name=category]'));
        a = suggest
        suggest.getSuggestItems = function (text) {
            var r = [];
            for (var category in Demo.DplList.tree[key]) {
                if (category.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
                    r.push(category);
                }
            }

            return r;
        };

        var suggest2 = new Suggest(form.find('[name=name]'));

        suggest2.getSuggestItems = function (text) {
            var r = [];
            for (var category in (Demo.DplList.tree[key] || {})[form.find('[name=category]').getText()]) {
                if (category.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
                    r.push(category);
                }
            }

            return r;
        };

    },

    submitForm: function (formElem, redirectTo) {
        var form = Dom.get(formElem);
        var module = form.find('[name=module]').getText();
        var category = form.find('[name=category]').getText();
        var name = form.find('[name=name]').getText();
        var hasError = false;

        form.query('.x-textbox-error').removeClass('x-textbox-error');

        if (!category) {
            hasError = true;
            form.find('[name=category]').addClass('x-textbox-error');
        }

        if (!name) {
            hasError = true;
            form.find('[name=name]').addClass('x-textbox-error');
        }

        if (hasError) {
            return;
        }

        if (!(Demo.DplList.tree[module] || {})[category] && !confirm('分类 ' + category + ' 不存在。是否创建分类?')) {
            return;
        }

        var title = form.find('[name=title]').getText();
        form.find('[name=postback]').setText(redirectTo ? Demo.getDemoUrl(module + '.' + category + '.' + name) : location.href);

        form.submit();
    }

};

Demo.writeDplList = function (values) {

    Demo.DplList.list = DplList;
    Demo.DplList.tree = Demo.listToTree(DplList);

    var list = Demo.DplList.list, tree = Demo.DplList.tree, key, a, ai, b, bi, c, controlInfo, html = '', html2, all, finish;

    var from = decodeURIComponent((/(&|\?)from=(.*?)(&|$)/.exec(location.href) || [0, 0, ""])[2]);

    for (key in values) {

        finish = all = 0;
        html2 = '';

        a = tree[key];

        for (ai in a) {

            html2 += '<section class="demo"><h3 class="demo">' + ai + '</h3><ul>';

            b = a[ai];

            for(bi in b){

                c = b[bi];

                controlInfo = list[c];

                var url = Demo.getDemoUrl(c);

                html2 += '<li><a href="' + url + '" class="status-' + controlInfo.status + (from === url ? ' current' : '') + '">' + bi + '(' + controlInfo.name + ')</a></li>';

                switch (controlInfo.status) {
                    case 'ok':
                    case 'compact':
                    case 'complete':
                        finish++;

                    // fall through
                    case 'develop':
                    case 'plan':
                        all++;
                }

            }

            html2 += '</ul></section>';


        }

        if (html2) {
            html += '<article class="demo demo-grid demo-grid-5"><nav class="demo-toolbar"><a href="javascript://在此分类添加一个组件" class="x-linkbutton" onclick="Demo.DplList.addDpl(this.parentNode, \'' + key + '\')">✚ 添加组件</a></nav><h2 class="demo">' + key + '(' + values[key] + ')' + '<small>' + finish + '/' + all + '</small></h2>' + html2 + '</article>';
        }

    }

    document.write(html);

};