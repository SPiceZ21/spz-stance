fx_version 'cerulean'
game 'gta5'
ui_page 'html/index.html'
lua54 'on'

shared_scripts {
	"config.lua"
}

server_scripts {
    'server/main.lua'
}
client_scripts {
    'client/main.lua',
}

files {
	'html/index.html',
	'html/fonts/*.ttf',
	'html/audio/*.ogg'
}