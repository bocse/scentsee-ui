'use strict';

appControllers.controller('NetworkCtrl',['$scope', '$http', '$routeParams', '$cookies', '$rootScope','$timeout', 'SingularSelectizeService',
    function($scope, $http, $routeParams, $cookies, $rootScope, $timeout, SingularSelectizeService ) {

        $scope.initDemo=function()
        {

                var DIR = 'img/soft-scraps-icons/';

                var nodes = null;
                var edges = null;
                var network = null;


                var DIR = '../img/indonesia/';
                nodes=[{"image":"http://pimages.parfumo.de/240/186_drhafrsgu7_240.jpg","size":35,"shape":"circularImage","borderWidth":3,"mass":5.0,"borderWidthSelected":4,"brokenImage":"/images/logos/logo-00.png","id":6555264861307625,"label":"Bvlgari Aqva pour Homme","title":{"CITRIC":20,"GREEN":20,"HERBACIOUS":10,"SYNTHETIC":10,"AMBER":10},"font":"14px arial navy"},{"image":"http://pimages.parfumo.de/240/1484_4hbvvpi4gp_240.jpg","size":35,"shape":"circularImage","borderWidth":3,"mass":5.0,"borderWidthSelected":4,"brokenImage":"/images/logos/logo-00.png","id":6612318931460398,"label":"Dolce  Gabbana Light Blue pour Homme","title":{"CITRIC":23,"SPICY":15,"HERBACIOUS":7,"ORIENTAL":7,"GREEN":7},"font":"14px arial navy"},{"image":"http://pimages.parfumo.de/240/35979_xgzp8kvdw0_240.jpg","shape":"circularImage","mass":2.0,"brokenImage":"/images/logos/logo-00.png","id":900931539244412,"label":"Captain Fawcett's Captain Fawcett's Eau de Parfum","title":{"SPICY":25,"CITRIC":25,"ORIENTAL":12,"WOODY":12,"MOSSY":12},"font":"14px arial navy"},{"image":"","shape":"circularImage","mass":2.0,"brokenImage":"/images/logos/logo-00.png","id":3605909639818642,"label":"Dunhill Desire Black","title":{"CITRIC":21,"SPICY":14,"WOODY":14,"SYNTHETIC":7,"AMBER":7},"font":"14px arial navy"},{"image":"http://pimages.parfumo.de/240/6918_prjkvyg0x0_240.jpg","shape":"circularImage","mass":2.0,"brokenImage":"/images/logos/logo-00.png","id":7304782909001077,"label":"Laura Biagiotti Mistero di Roma Uomo","title":{"CITRIC":27,"WOODY":18,"SPICY":9,"AMBER":9,"ORIENTAL":9},"font":"14px arial navy"},{"image":"http://pimages.parfumo.de/240/401_pn6n8gr7ji_240.jpg","shape":"circularImage","mass":2.0,"brokenImage":"/images/logos/logo-00.png","id":7591551725785743,"label":"Dunhill Dunhill Pursuit","title":{"WOODY":23,"CITRIC":17,"SPICY":11,"ORIENTAL":11,"GREEN":11},"font":"14px arial navy"},{"image":"http://pimages.parfumo.de/240/1757_4t8yz0ghhb_240.jpg","shape":"circularImage","mass":2.0,"brokenImage":"/images/logos/logo-00.png","id":24534804949735,"label":"Lanvin Lanvin L'Homme Sport","title":{"CITRIC":21,"HERBACIOUS":14,"GREEN":14,"SYNTHETIC":7,"SPICY":7},"font":"14px arial navy"},{"image":"http://pimages.parfumo.de/240/2586_tq2quarar2_240.jpg","shape":"circularImage","mass":2.0,"brokenImage":"/images/logos/logo-00.png","id":5225472138169031,"label":"Annayaké Undo","title":{"CITRIC":18,"SPICY":12,"GREEN":12,"HERBACIOUS":6,"TEA":6},"font":"14px arial navy"},{"image":"http://pimages.parfumo.de/240/61593_c2eioh_ultimate_240.jpg","shape":"circularImage","mass":2.0,"brokenImage":"/images/logos/logo-00.png","id":8178406591211838,"label":"Baldessarini Ultimate","title":{"FLORAL":25,"CITRIC":16,"ORIENTAL":16,"SPICY":8,"AMBER":8},"font":"14px arial navy"},{"image":"http://pimages.parfumo.de/240/2227_kqh3v6oqwm_240.jpg","shape":"circularImage","mass":2.0,"brokenImage":"/images/logos/logo-00.png","id":3141932645722829,"label":"Givenchy Givenchy pour Homme","title":{"CITRIC":18,"GREEN":18,"WOODY":18,"HERBACIOUS":9,"SPICY":9},"font":"14px arial navy"}];

                // create connections between people
                // value corresponds with the amount of contact between two people
                edges=[{"width":0.19856739111019614,"from":24534804949735,"to":8178406591211838,"opacity":0.06618913037006538},{"width":0.5392026276035045,"from":3605909639818642,"to":7591551725785743,"opacity":0.17973420920116817},{"width":0.7325824553539089,"from":3141932645722829,"to":8178406591211838,"opacity":0.2441941517846363},{"width":1.1221062620505715,"from":900931539244412,"to":6612318931460398,"opacity":0.3740354206835238},{"width":0.6330636477222797,"from":24534804949735,"to":3141932645722829,"opacity":0.21102121590742656},{"width":1.807673865941601,"from":3605909639818642,"to":7304782909001077,"opacity":0.602557955313867},{"width":3.0,"from":7304782909001077,"to":7591551725785743,"opacity":1.0},{"width":0.28183646981948496,"from":24534804949735,"to":7591551725785743,"opacity":0.09394548993982832},{"width":0.6412371094979594,"from":7591551725785743,"to":8178406591211838,"opacity":0.21374570316598646},{"width":1.6773892794397334,"from":24534804949735,"to":3605909639818642,"opacity":0.5591297598132444},{"width":0.3242728478067602,"from":3141932645722829,"to":7591551725785743,"opacity":0.10809094926892006},{"width":0.8914976494269582,"from":3605909639818642,"to":8178406591211838,"opacity":0.2971658831423194},{"width":1.2139701143630004,"from":5225472138169031,"to":6612318931460398,"opacity":0.4046567047876668},{"width":0.9590284117213836,"from":3141932645722829,"to":7304782909001077,"opacity":0.31967613724046123},{"width":1.4204393367465538,"from":7304782909001077,"to":8178406591211838,"opacity":0.47347977891551796},{"width":2.1580572822157564,"from":900931539244412,"to":5225472138169031,"opacity":0.7193524274052522},{"width":2.2850745673579347,"from":5225472138169031,"to":7591551725785743,"opacity":0.7616915224526448},{"width":0.4695729307633775,"from":3141932645722829,"to":6612318931460398,"opacity":0.15652431025445918},{"width":1.2089794513556895,"from":900931539244412,"to":8178406591211838,"opacity":0.4029931504518965},{"width":0.025348659817105733,"from":3605909639818642,"to":6555264861307625,"opacity":0.008449553272368578},{"width":1.8946215170896485,"from":5225472138169031,"to":7304782909001077,"opacity":0.6315405056965495},{"width":0.7987795466286617,"from":6612318931460398,"to":8178406591211838,"opacity":0.26625984887622056},{"width":0.0,"from":900931539244412,"to":3141932645722829,"opacity":0.0},{"width":0.8804476684218284,"from":24534804949735,"to":6612318931460398,"opacity":0.2934825561406095},{"width":1.9176444836081141,"from":3141932645722829,"to":5225472138169031,"opacity":0.6392148278693713},{"width":1.2914462260369521,"from":6612318931460398,"to":7304782909001077,"opacity":0.4304820753456507},{"width":2.1680584372360743,"from":900931539244412,"to":7304782909001077,"opacity":0.722686145745358},{"width":0.3731963796456467,"from":5225472138169031,"to":8178406591211838,"opacity":0.12439879321521558},{"width":1.300458122730768,"from":24534804949735,"to":5225472138169031,"opacity":0.43348604091025605},{"width":2.480605124502692,"from":900931539244412,"to":7591551725785743,"opacity":0.8268683748342306},{"width":1.5039615548103544,"from":3605909639818642,"to":6612318931460398,"opacity":0.5013205182701181},{"width":1.1196111131362314,"from":6612318931460398,"to":7591551725785743,"opacity":0.37320370437874384}];

                // create a network
                var container = document.getElementById('fragranceNetwork');
                var data = {
                    nodes: nodes,
                    edges: edges
                };
                var options = {
                    nodes: {
                        borderWidth:4,
                        size:30,
                        color: {
                            border: '#ffffff',
                            background: '#ffffff'
                        },
                        font:{color:'#222222'}
                    },
                    edges: {
                        color: 'gray'
                    }
                };
                network = new vis.Network(container, data, options);


        };
        $scope.loadScript = function(url, type, charset) {
            if (type===undefined) type = 'text/javascript';
            if (url) {
                var script = document.querySelector("script[src*='"+url+"']");
                if (!script) {
                    var heads = document.getElementsByTagName("head");
                    if (heads && heads.length) {
                        var head = heads[0];
                        if (head) {
                            script = document.createElement('script');
                            script.setAttribute('src', url);
                            script.setAttribute('type', type);
                            if (charset) script.setAttribute('charset', charset);
                            head.appendChild(script);
                        }
                    }
                }
                return script;
            }
        };

        $scope.loadScript('js/lib/vis.min.js', 'text/javascript', 'utf-8');
        $timeout( function(){  $scope.initDemo(); }, 3000);
    }]);


