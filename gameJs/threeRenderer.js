
/**
 * Created by panda on 15/04/2015.
 */

function ThreeRenderer(cursors) {
    "use strict";
    if(cursors === undefined)
        cursors = 1;
    this.camera = this.CreateCamera();
    this.renderer = this.CreateRenderer();
    this.light = this.CreateLight();
    this.cursor = [this.CreateCursor(0x008080)];
    for(var i = 1; i < cursors; i+=1){
        this.cursor.push(this.CreateCursor(0x800080));
    }
    this.scene = this.CreateScene();
    this.offset = 0;
    this.id = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
}
ThreeRenderer.prototype.clear = function(){
    "use strict";
    this.scene = null;
    this.light = null;
    this.camera = null;
    this.cursor = null;
    this.renderer = null;
};

ThreeRenderer.prototype.CreateLight = function () {
    "use strict";
    var dLight = new THREE.DirectionalLight(0xcccccc);
    dLight.position.set(500, 1000, 2000);
    dLight.castShadow = true;
    dLight.shadowCameraVisible = false;
    dLight.shadowDarkness = 0.2;
    dLight.shadowMapWidth = dLight.shadowMapHeight = 1000;
    return dLight;
};

ThreeRenderer.prototype.CreateScene = function () {
    "use strict";
    var scene = new THREE.Scene();
    scene.add(this.light);
    for(var i = 0; i < this.cursor.length; i+= 1) {
        scene.add(this.cursor[i]);
    }

    var geometry = new THREE.PlaneGeometry( 1000, 400 ); //FIXME magic numbers
    //now try to get everything with transparent true above this plane or your going to cry :)
    var material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true, opacity: 0.5} );
    var cube = new THREE.Mesh( geometry, material );
    cube.rotation.x += 1.62;
    cube.position.setY(CONFIG.hiddenRowCount*CONFIG.pixelPerBox - CONFIG.pixelPerBox/2 );
    cube.renderDepth=1;
    scene.add( cube );

    geometry = new THREE.BoxGeometry( 1000, 3, 3);
    material = new THREE.MeshPhongMaterial( { color: 0x330000, emissive: 0x990000} );
    var line = new THREE.Mesh( geometry, material );
    line.position.set(0,(CONFIG.hiddenRowCount+CONFIG.displayedRowCount)*CONFIG.pixelPerBox,10);
    scene.add( line );

    geometry = new THREE.BoxGeometry( 1000, 3, 3);
    material = new THREE.MeshPhongMaterial( { color: 0x003300, emissive: 0x009900} );
    line = new THREE.Mesh( geometry, material );
    line.position.set(0,(CONFIG.hiddenRowCount)*CONFIG.pixelPerBox - CONFIG.pixelPerBox/2 + 5,10);
    scene.add( line );

    return scene;
};

ThreeRenderer.prototype.CreateCamera = function (){
    "use strict";
    var camera = new THREE.PerspectiveCamera( 75, 420/600, 0.3, 1000 );
    camera.position.z = 450;
    camera.position.x = -27;
    camera.position.y = 410;
    return camera;
};

ThreeRenderer.prototype.CreateRenderer = function (){
    "use strict";
    var renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setClearColor(0x000000);
    renderer.setSize( 420, 600 );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    return renderer;
};

ThreeRenderer.prototype.AddCube = function (color) {
    "use strict";
    var geometry = new THREE.BoxGeometry( CONFIG.pixelPerBox*0.7, CONFIG.pixelPerBox*0.7, CONFIG.pixelPerBox /4);
    var material = new THREE.MeshPhongMaterial( { color: color, emissive: 0x111111} );
    var newCube = new THREE.Mesh( geometry, material );
    this.scene.add( newCube );
    return newCube.id;
};

function CalculateX(block, x)
{
    "use strict";
    if(block.state === Block.EState.SwappedLeft)
    {
        return x + CONFIG.pixelPerBox/100*(100-block.animationState);
    }
    if(block.state === Block.EState.SwappedRight)
    {
        return x - CONFIG.pixelPerBox/100*(100-block.animationState);
    }
    return x;
}

ThreeRenderer.prototype.UpdateCube = function (x, block) {
    "use strict";
    var cube = this.scene.getObjectById(block.id);
    cube.position.setY(block.verticalPosition + this.offset);
    cube.position.setX(CalculateX(block, x));
    cube.material.color = new THREE.Color(block.GetHexColor()); //no need for math and allocation each time :)
    if(block.state === Block.EState.Disappearing) {
        cube.material.opacity = Math.max(1 - block.animationState/100, 0);
        cube.material.transparent = true;
    }

    if(cube.material.opacity === 0) {
        this.scene.remove(cube);
        block.id = -1;
    }
};

ThreeRenderer.prototype.Render = function() {
    "use strict";
    this.light.position.setY(1000 + this.offset);
    this.renderer.render(this.scene, this.camera);
};

ThreeRenderer.prototype.LinkDom = function (container) {
    "use strict";
    this.renderer.domElement.setAttribute('id', this.id);
    var node = $("#"+container+" .gamePlaceHolder");
    if (node.length === 0){
        throw container+"missing gameplaceHolder";
    }
    node.empty();
    node.append($(this.renderer.domElement));
};

ThreeRenderer.prototype.UnlinkDom = function () {
    "use strict";
    var element = document.getElementById(this.id);
    if(element !== null){
        element.parentNode.removeChild(element);
    }
};


ThreeRenderer.prototype.CreateCursor = function(color){
    "use strict";
    var trackShape = new THREE.Shape();


    trackShape.absarc( 72, -13, 10, -Math.PI/2, 0, true );
    trackShape.lineTo( 82, 0 );
    trackShape.absarc( 72, 13, 10, 0,Math.PI/2, true );
    trackShape.lineTo( 35, 20 );
    trackShape.lineTo( 35, 0 );
    trackShape.absarc( -2, -13, 10, 3*Math.PI/2, Math.PI, true );
    trackShape.lineTo( -12, 0 );
    trackShape.absarc( -2, 13, 10, Math.PI, Math.PI/2, true );
    trackShape.lineTo( 35, -20 );

    return new THREE.PointCloud(trackShape.createPointsGeometry(), new THREE.PointCloudMaterial({
        color: color,
        size: 4
    }));
};

ThreeRenderer.prototype.DrawCursorOn = function(x,y, cursorId){
    "use strict";
    if(cursorId === undefined)
        cursorId = 0;
    this.cursor[cursorId].position.set((x - (CONFIG.columnCount)/2)*CONFIG.pixelPerBox -10  , y*(CONFIG.pixelPerBox-0.5) + this.offset +5 , 7);

};

ThreeRenderer.prototype.Freeze = function(){
    "use strict";
    for(var i =0; i < this.cursor.length; i+=1){
        this.scene.remove(this.cursor[i]);
    }
    this.Render();
};

ThreeRenderer.prototype.RenderTetris = function(tetris){
    "use strict";

    this.offset = tetris.groundPos;
    var block;
    for(var i = 0; i < CONFIG.columnCount; i += 1) {
        for( var j = 0; j < tetris.grid.container[i].length; j+= 1) {
            block = tetris.grid.container[i][j];
            if(block.type !== Block.EType.PlaceHolder)
            {
                if(block.id === -1)
                {
                    block.id = this.AddCube(block.GetHexColor());
                }
                this.UpdateCube((i - CONFIG.columnCount/2) * CONFIG.pixelPerBox, block);
            }
        }
    }
    for(i = 0; i < tetris.cursor.length; i+= 1){
        this.DrawCursorOn(tetris.cursor[i].x,tetris.cursor[i].y,i);
    }
    this.Render();
};