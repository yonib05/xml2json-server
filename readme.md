# JSON2XML SERVER

JSON2XML Server was an interface designed to very efficiently convert any json request to xml and route it to an appropriate request location.

## Installation

Just run
 npm install
 node server.js
and your good to start sending over requests

## Usage

TODO: Write usage instructions

Example Request:

```json
POST  HTTP/1.1
Host: localhost:8080
Content-Type: application/json
req-host: clientws.prolog3pl.com
req-action: http://prolog3pl.com/PLSubmitOrder
req-protocol: http:
Authorization: Basic ****
req-path: /ProWaresService.asmx

{
	"soap:Envelope": {
		"-xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
		"-xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
		"-xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
		"soap:Body": {
			"PLSubmitOrder": {
				"-xmlns": "http://prolog3pl.com/",
				"args": {
					"SystemId": "999system",
					"Password": "prolog",
					"Orders": {
						"PLOrder":
							{
								"OrderNumber": "ORD-10000",
								"CustomerNumber" : "",
								"CustomerOrderNumber" : "",
								"CustomerPO" : "",
								"OrderDate": "2008-05-07T12:00:00",
								"Delay": 0,
								"AutoAllocate": true,
								"PartialShip": false,
								"ShippingService": "UPS Ground",
								"BillThridParty": false,
								"AccountNumber" : "123",
								"SaturdayDelivery": false,
								"Residential": false,
								"InsurePackages": false,
								"InsureThreshold": 1000.00,
								"EmailConfirmationAddress": "test@email.com",
								"PackingListTemplate": "Standard Packing List (Get from ProLog)",
								"PackingListComment": "Thanks for your order.",
								"OrderProcessingVariation" : "1234",
								"Subtotal": 120.00,
								"Shipping": 25.56,
								"Handling": 0.00,
								"Discount": 0.00,
								"Tax": 0.00,
								"Total": 145.56,
								"OrderLines":{
									"PLOrderLine" : [
										{
											"LineNumber": "1",
											"Product": "PRODUCT1",
											"Description": "Replacement part or a bigger product.",
											"Quantity": "2",
											"Price": 60.00,
											"DeclaredValue" : 100.00
										},
										{
											"LineNumber": "1",
											"Product": "PRODUCT1",
											"Description": "Replacement part or a bigger product.",
											"Quantity": "2",
											"DeclaredValue" : 100.00
										}
									]
								},
								"ShippingAddress": {
									"FirstName": "Michael",
									"LastName": "Smith",
									"CompanyName": "XYZ, Inc.",
									"Address1": "1234 Simple Ave",
									"Address2": "#25",
									"Address3": "#25",
									"City": "San Diego",
									"State": "CA",
									"PostalCode": "92120",
									"Country": "US",
									"PhoneNumber": "555-555-5555",
									"EmailAddress": "mike@xyz.com"
								},
								"BillingAddress": {
									"FirstName": "Michael",
									"LastName": "Smith",
									"CompanyName": "XYZ, Inc.",
									"Address1": "1234 Simple Ave",
									"Address2": "#25",
									"Address3": "#25",
									"City": "San Diego",
									"State": "CA",
									"PostalCode": "92120",
									"Country": "US",
									"PhoneNumber": "555-555-5555",
									"EmailAddress": "mike@xyz.com"
								}
							}
					}
				}
			}
		}
	}
}

```


Example forwarded request
```xml
POST /ProWaresService.asmx HTTP/1.1
Host: clientws.prolog3pl.com
Content-Type: text/xml; charset=utf-8
Content-Length: <contentlength/>
SOAPAction: "http://prolog3pl.com/PLSubmitOrder"


<?xml version="1.0" encoding="UTF-8" ?>
	<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
		<soap:Body>
			<PLSubmitOrder xmlns="http://prolog3pl.com/">
				<args>
					<SystemId>999system</SystemId>
					<Password>prolog</Password>
					<Orders>
						<PLOrder>
							<OrderNumber>ORD-10000</OrderNumber>
							<CustomerNumber></CustomerNumber>
							<CustomerOrderNumber></CustomerOrderNumber>
							<CustomerPO></CustomerPO>
							<OrderDate>2008-05-07T12:00:00</OrderDate>
							<Delay>0</Delay>
							<AutoAllocate>true</AutoAllocate>
							<PartialShip>false</PartialShip>
							<ShippingService>UPS Ground</ShippingService>
							<BillThridParty>false</BillThridParty>
							<AccountNumber>123</AccountNumber>
							<SaturdayDelivery>false</SaturdayDelivery>
							<Residential>false</Residential>
							<InsurePackages>false</InsurePackages>
							<InsureThreshold>1000</InsureThreshold>
							<EmailConfirmationAddress>test@email.com</EmailConfirmationAddress>
							<PackingListTemplate>Standard Packing List (Get from ProLog)</PackingListTemplate>
							<PackingListComment>Thanks for your order.</PackingListComment>
							<OrderProcessingVariation>1234</OrderProcessingVariation>
							<Subtotal>120</Subtotal>
							<Shipping>25.56</Shipping>
							<Handling>0</Handling>
							<Discount>0</Discount>
							<Tax>0</Tax>
							<Total>145.56</Total>
							<OrderLines>
								<PLOrderLine>
									<LineNumber>1</LineNumber>
									<Product>PRODUCT1</Product>
									<Description>Replacement part or a bigger product.</Description>
									<Quantity>2</Quantity>
									<Price>60</Price>
									<DeclaredValue>100</DeclaredValue>
								</PLOrderLine>
								<PLOrderLine>
									<LineNumber>1</LineNumber>
									<Product>PRODUCT1</Product>
									<Description>Replacement part or a bigger product.</Description>
									<Quantity>2</Quantity>
									<DeclaredValue>100</DeclaredValue>
								</PLOrderLine>
							</OrderLines>
							<ShippingAddress>
								<FirstName>Michael</FirstName>
								<LastName>Smith</LastName>
								<CompanyName>XYZ, Inc.</CompanyName>
								<Address1>1234 Simple Ave</Address1>
								<Address2>#25</Address2>
								<Address3>#25</Address3>
								<City>San Diego</City>
								<State>CA</State>
								<PostalCode>92120</PostalCode>
								<Country>US</Country>
								<PhoneNumber>555-555-5555</PhoneNumber>
								<EmailAddress>mike@xyz.com</EmailAddress>
							</ShippingAddress>
							<BillingAddress>
								<FirstName>Michael</FirstName>
								<LastName>Smith</LastName>
								<CompanyName>XYZ, Inc.</CompanyName>
								<Address1>1234 Simple Ave</Address1>
								<Address2>#25</Address2>
								<Address3>#25</Address3>
								<City>San Diego</City>
								<State>CA</State>
								<PostalCode>92120</PostalCode>
								<Country>US</Country>
								<PhoneNumber>555-555-5555</PhoneNumber>
								<EmailAddress>mike@xyz.com</EmailAddress>
							</BillingAddress>
						</PLOrder>
					</Orders>
				</args>
			</PLSubmitOrder>
		</soap:Body>
	</soap:Envelope>
```


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

TODO: Write history

## Credits

Special thanks to @cherrry for xml-objtree which this project is based on.

## License

MIT
