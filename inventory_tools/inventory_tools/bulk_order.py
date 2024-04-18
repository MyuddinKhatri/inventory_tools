import json
import frappe
from erpnext.e_commerce.shopping_cart.cart import update_cart

@frappe.whitelist()
def create_quotation(quote_data: str, is_processed: bool = False):
	"""
	This function is for bulk orders: 
	agrs:
		quote_data: string or stringified data
		is_processed: to identify if string needs to be processed and extract SKU & Quantity out of it
	scope: watch or enqueue update_cart
	"""
	is_processed = bool(is_processed)
	if is_processed:
		for line_item in quote_data.split("\n"):
			sku_qty = line_item.split("\t")
			update_cart(item_code=sku_qty[0], qty=sku_qty[1])
	else:
		quote_data = json.loads(quote_data)
		for line_item in quote_data:
			update_cart(item_code=line_item.get("sku"), qty=line_item.get("qty"))