# Item-Trading-App
Item Trading App is simulating a trading system of some items using a fictional currency.  
This client consumes the Item-Trading-App-REST-API which can be found here: https://github.com/ClaudiuBrandusa/Item-Trading-App-REST-API

## App walkthrough
### Identity part
#### Register
![image](/resources/identity/register.png)
#### Login
![image](/resources/identity/login.png)
### Index part
#### Index
![image](/resources/index/index.png)
![image](/resources/index/notifications.png)
### Items part
#### List items
Here we are listing all of the items available in the application.  
![image](/resources/item/items.png)
#### Create item
![image](/resources/item/create_item.png)
#### Edit item
![image](/resources/item/edit_item.png)
#### Delete item
![image](/resources/item/delete_item.png)
#### Attempting to delete a used item
![image](/resources/item/delete_used_item.png)
### Inventory part
Here we are listing all of the items that we have in the inventory.  
![image](/resources/inventory/inventory.png)
#### Add item to inventory
##### Select item
![image](/resources/inventory/select_item.png)
![image](/resources/inventory/select_item_found.png)
##### Choose the quantity of this item to add
![image](/resources/inventory/set_item_quantity.png)
#### Drop item from the inventory
![image](/resources/inventory/drop_item.png)
### Trade part
#### List trades
![image](/resources/trade/trades.png)
#### Use trade search filtering
![image](/resources/trade/trades_filtering.png)
#### Create a new trade
##### Select a trade receiver
![image](/resources/trade/select_receiver.png)
##### Select trade items
![image](/resources/trade/select_trade_items.png)
##### Select trade item quantity and price
![image](/resources/trade/set_quantity_and_price.png)
##### Review your selected trade items and then confirm by clicking on `Create trade` button
![image](/resources/trade/trade_item_selected.png)
##### The receiver of the trade will get the following notification
![image](/resources/trade/received_trade_notification.png)
### Trade interactions
#### Cancel a sent trade
![image](/resources/trade/cancel_trade.png)
#### Respond to a received trade
![image](/resources/trade/respond_trade.png)
#### View trade details
![image](/resources/trade/trade_details.png)

## References
I used [coolors.co](https://coolors.co/) for the css color classes from [colors.css](src/css/colors.css).
