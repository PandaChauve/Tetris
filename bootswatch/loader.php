<?php
//avoid caching this one ^^
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

//FIXME this was the sad but easy way
//why php ? because i had to install it for other stuff on my apache server => it was the fastest way to do that ...
//you should install what you want on your apache server to serve this
//you can also use a static css but is the use use another theme it will briefly flicker


header("Content-type: text/css; charset: UTF-8");
$theme = 'slate';
if(isset($_COOKIE['csstheme']) && ctype_alpha($_COOKIE['csstheme'])) //is set and is the current folder
{
    $theme = strtolower($_COOKIE['csstheme']);
}
print file_get_contents($theme.".min.css");
?>
