SPZ = SPZ or {}

SPZ.Notify = function(src, msg, type, time)
    TriggerClientEvent("spz-lib:Notify", src, msg, type or "info", time or 3000)
end

stancer = {}

Citizen.CreateThread(function()
  local ret = exports.oxmysql:fetchSync('SELECT * FROM spz_stance', {})
  if ret then
      for k,v in pairs(ret) do
        if stancer[v.plate] == nil then stancer[v.plate] = {} end
        stancer[v.plate].plate = v.plate
        stancer[v.plate].stancer = json.decode(v.setting)
        stancer[v.plate].online = false
      end
  end

  for k,v in ipairs(GetAllVehicles()) do
    local plate = GetVehicleNumberPlateText(v)
    if stancer[plate] and plate == stancer[plate].plate then
      if stancer[plate].stancer then
        local ent = Entity(v).state
        ent.stancer = stancer[plate].stancer
        ent.online = true
      end
    end
  end
end)

function SaveStancer(ob)
    local plate = string.gsub(ob.plate, '^%s*(.-)%s*$', '%1')
    local result = exports.oxmysql:fetchSync('SELECT * FROM spz_stance WHERE TRIM(plate) = ?', {plate})
    if not result or result[1] == nil then
        exports.oxmysql:insertSync('INSERT INTO spz_stance (plate, setting) VALUES (?, ?)', {
            ob.plate,
            '[]',
        })
    else
        exports.oxmysql:updateSync('UPDATE spz_stance SET setting = ? WHERE TRIM(plate) = ?', {
          json.encode(ob.setting),
          plate,
        })
    end
end

function SqlFunc(query, var)
    return exports.oxmysql:fetchSync(query, var)
end

function SqlExecute(query, var)
    return exports.oxmysql:executeSync(query, var)
end

function firstToUpper(str)
  return (str:gsub("^%l", string.upper))
end

Citizen.CreateThread(function()
  print(" STANCER LOADED ")
  local brand = [[
  8888888888 d8b                                                           888                        
  888        Y8P                                                           888                        
  888                                                                      888                        
  8888888    888 888  888  .d88b.  88888b.d88b.  88888b.d88b.     .d8888b  88888b.   .d88b.  88888b.  
  888        888 888  888 d8P  Y8b 888 "888 "88b 888 "888 "88b    88K      888 "88b d88""88b 888 "88b 
  888        888 Y88  88P 88888888 888  888  888 888  888  888    "Y8888b. 888  888 888  888 888  888 
  888        888  Y8bd8P  Y8b.     888  888  888 888  888  888 d8b     X88 888  888 Y88..88P 888 d88P 
  888        888   Y88P    "Y8888  888  888  888 888  888  888 Y8P 88888P' 888  888  "Y88P"  88888P"  
                                                                                             888      
                                                                                             888      
                                                                                             888      ]]
  print(brand)
end)



function AddStancerKit(veh)
  local veh = veh
  if veh == nil then veh = GetVehiclePedIsIn(GetPlayerPed(source),false) end
  plate = GetVehicleNumberPlateText(veh)
  if not stancer[plate] then
    stancer[plate] = {}
    local ent = Entity(veh).state
    if not ent.stancer then
      stancer[plate].stancer = {}
      stancer[plate].plate = plate
      stancer[plate].online = true
      ent.stancer = stancer[plate]
      SaveStancer({plate = plate, setting = {}})
    end
  end
end

exports('AddStancerKit', function(vehicle)
  return AddStancerKit(vehicle)
end)

AddEventHandler('entityCreated', function(entity)
  local entity = entity
  Wait(4000)
  if DoesEntityExist(entity) and GetEntityPopulationType(entity) == 7 and GetEntityType(entity) == 2 then
    local plate = GetVehicleNumberPlateText(entity)
    if stancer[plate] and stancer[plate].stancer then
      local ent = Entity(entity).state
      ent.stancer = stancer[plate].stancer
      stancer[plate].online = true
    end
  end
end)

AddEventHandler('entityRemoved', function(entity)
  local entity = entity
  if DoesEntityExist(entity) and GetEntityPopulationType(entity) == 7 and GetEntityType(entity) == 2 then
    local ent = Entity(entity).state
    if ent.stancer then
      local plate = GetVehicleNumberPlateText(entity)
      stancer[plate].online = false
      stancer[plate].stancer = ent.stancer
      SaveStancer({plate = plate, setting = stancer[plate].stancer})
    end
  end
end)

RegisterNetEvent("spz-stance:addstancer") -- Standalone Purpose
AddEventHandler("spz-stance:addstancer", function(vehicle)
	AddStancerKit(vehicle)
end)

RegisterNetEvent("spz-stance:airsuspension")
AddEventHandler("spz-stance:airsuspension", function(entity,val,coords)
	TriggerClientEvent("spz-stance:airsuspension", -1, entity,val,coords)
end)
