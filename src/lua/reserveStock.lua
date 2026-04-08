const reserveStock = `
  --duyet kiem tra xem so luong trong kho du voi so luong mua k
  for i, key in ipairs(KEYS) do 
    local quantityToBuy = tonumber(ARGV[i])
    local  currentStock = tonumber(redis.call('GET', key) or 0)
    if(currentStock < quantityToBuy) then
        return 0
    end
  end
  --tru so luong trong kho
  for i, key ipairs(KEYS) do 
    local quantityToBuy = tonumber(ARGV[i])
    redis.call('DECRBY', key, quantityToBuy)
  end
  return 1
`;
