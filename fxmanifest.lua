fx_version 'cerulean'
game 'gta5'
version '1.0.8'
ui_page 'html/dist/index.html'
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
	'html/dist/**/*',
	'html/audio/*.ogg'
}
