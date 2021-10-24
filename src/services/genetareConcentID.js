import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {numberFloatFormater} from '../utils/utilsGeneral'
export default async function genetareConcentID(amount, infoComercio, jwtCIBC ) {

    if(!infoComercio?.account_number || infoComercio?.bank_sheme || infoComercio?.name_titular_bank || jwtCIBC ) {
        return { estatus: false, url: ""}
    }

    const data = JSON.stringify({
            "Data": {
                "Initiation": {
                "InstructionIdentification": "instr-identification",
                "EndToEndIdentification": "e2e-identification",
                "InstructedAmount": {
                    "Amount": numberFloatFormater(amount),
                    "Currency": "CAD"
                },
                "DebtorAccount": null,
                "CreditorAccount": {
                    "SchemeName": infoComercio?.bank_sheme,
                    "Identification": infoComercio?.account_number,
                    "Name":  infoComercio?.name_titular_bank,
                    "SecondaryIdentification": "secondary-identif"
                },
                "RemittanceInformation": {
                    "Unstructured": "Tools",
                    "Reference": "Tools"
                }
                }
            },
            "Risk": {
                "PaymentContextCode": "EcommerceGoods",
                "MerchantCategoryCode": null,
                "MerchantCustomerIdentification": null,
                "DeliveryAddress": null
            }
            });

    const config = {
        method: 'post',
        url: 'https://api.cibc.useinfinite.io/open-banking/v3.1/pisp/bnpl-payment-consents',
        headers: { 
            'Authorization': 'Bearer '+ jwtCIBC, 
            'x-fapi-financial-id': 'TBD', 
            'Content-Type': 'application/json', 
            //'x-jws-signature': 'DUMMY_SIG', 
            'x-idempotency-key': uuidv4()
        },
        data : data
    };
    try {
        const response = await axios(config)
        console.log(response)
    } 
    catch (error) {
        console.log(error)
        return { estatus: false, url: "" , mensaje: "error al generar la consulta http hacia https://api.cibc.useinfinite.io/open-banking/v3.1/pisp/bnpl-payment-consents"}

    }


}