--  kiểm tra xem trong kho có đủ hàng cho tất cả product không
for i, key in ipairs(KEYS) do
    local quantity = tonumber(ARGV[i])
    local currentStock = tonumber(redis.call('GET', key) or 0)
    
    -- Nếu có 1 món nào không đủ tồn kho thì hủy toàn bộ giao dịch
    if currentStock < quantity then
        return 0 
    end
end

-- Nếu tất cả prodcut đều đủ quantity thì bắt đầu trừ kho
for i, key in ipairs(KEYS) do
    local quantity = tonumber(ARGV[i])
    redis.call('DECRBY', key, quantity)
end

return 1