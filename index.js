const path = require('path');
const fs = require('fs').promises;
const {XmlSignature} = require('@supernova-team/xml-sunat');
const JSZip = require('jszip');
const fetch = require('node-fetch');
const {DOMParser} = require('@xmldom/xmldom');
const unzipper = require('unzipper');

const enviarComprobante = async () =>{
    //Folders

    const CDR_FOLDER = path.join(__dirname, 'cdr');
    const XML_FOLDER = path.join(__dirname, 'xml');
    const XML_FIRMADO_FOLDER = path.join(__dirname, 'xml-firmados');
    const ZIP_FOLDER = path.join(__dirname, 'zip');
    
    const datosEmisor = {
        ruc: '20607599727',
        razonSocial: "INSTITUTO INTERNACIONAL DE SOFTWARE S.A.C.",
        usuarioEmisor: "MODDATOS",
        claveEmisor: "MODDATOS",
    }
    
    const datosComprobante = {
        tipo: '01',
        serie: "F005",
        correlativo: 1721,
    }
    
    const nombreXml = `${datosEmisor.ruc}-${datosComprobante.tipo}-${datosComprobante.serie}-${datosComprobante.correlativo}`;
    
    const xml = `<?xml version="1.0" encoding="utf-8"?>
        <Invoice xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ccts="urn:un:unece:uncefact:documentation:2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:qdt="urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2" xmlns:udt="urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2" xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
            <ext:UBLExtensions>
                <ext:UBLExtension>
                    <ext:ExtensionContent/>
                </ext:UBLExtension>
            </ext:UBLExtensions>
            <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
            <cbc:CustomizationID schemeAgencyName="PE:SUNAT">2.0</cbc:CustomizationID>
            <cbc:ProfileID schemeName="Tipo de Operacion" schemeAgencyName="PE:SUNAT" schemeURI="urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo17">0101</cbc:ProfileID>
            <cbc:ID>${datosComprobante.serie}-${datosComprobante.correlativo}</cbc:ID>
            <cbc:IssueDate>2021-08-07</cbc:IssueDate>
            <cbc:IssueTime>00:00:00</cbc:IssueTime>
            <cbc:DueDate>2021-08-07</cbc:DueDate>
            <cbc:InvoiceTypeCode listAgencyName="PE:SUNAT" listName="Tipo de Documento" listURI="urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01" listID="0101" name="Tipo de Operacion">01</cbc:InvoiceTypeCode>
            <cbc:DocumentCurrencyCode listID="ISO 4217 Alpha" listName="Currency" listAgencyName="United Nations Economic Commission for Europe">PEN</cbc:DocumentCurrencyCode>
                    <cbc:LineCountNumeric>7</cbc:LineCountNumeric>
            <cac:Signature>
                <cbc:ID>F005-1721</cbc:ID>
                <cac:SignatoryParty>
                    <cac:PartyIdentification>
                        <cbc:ID>20607599727</cbc:ID>
                    </cac:PartyIdentification>
                    <cac:PartyName>
                        <cbc:Name><![CDATA[INSTITUTO INTERNACIONAL DE SOFTWARE S.A.C.]]></cbc:Name>
                    </cac:PartyName>
                </cac:SignatoryParty>
                <cac:DigitalSignatureAttachment>
                    <cac:ExternalReference>
                        <cbc:URI>#SignatureSP</cbc:URI>
                    </cac:ExternalReference>
                </cac:DigitalSignatureAttachment>
            </cac:Signature>
            <cac:AccountingSupplierParty>
                <cac:Party>
                    <cac:PartyIdentification>
                        <cbc:ID schemeID="6" schemeName="Documento de Identidad" schemeAgencyName="PE:SUNAT" schemeURI="urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06">20607599727</cbc:ID>
                    </cac:PartyIdentification>
                    <cac:PartyName>
                        <cbc:Name><![CDATA[INSTITUTO INTERNACIONAL DE SOFTWARE S.A.C.]]></cbc:Name>
                    </cac:PartyName>
                    <cac:PartyTaxScheme>
                        <cbc:RegistrationName><![CDATA[INSTITUTO INTERNACIONAL DE SOFTWARE S.A.C.]]></cbc:RegistrationName>
                        <cbc:CompanyID schemeID="6" schemeName="SUNAT:Identificador de Documento de Identidad" schemeAgencyName="PE:SUNAT" schemeURI="urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06">20607599727</cbc:CompanyID>
                        <cac:TaxScheme>
                            <cbc:ID schemeID="6" schemeName="SUNAT:Identificador de Documento de Identidad" schemeAgencyName="PE:SUNAT" schemeURI="urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06">20607599727</cbc:ID>
                        </cac:TaxScheme>
                    </cac:PartyTaxScheme>
                    <cac:PartyLegalEntity>
                        <cbc:RegistrationName><![CDATA[INSTITUTO INTERNACIONAL DE SOFTWARE S.A.C.]]></cbc:RegistrationName>
                        <cac:RegistrationAddress>
                            <cbc:ID schemeName="Ubigeos" schemeAgencyName="PE:INEI">140101</cbc:ID>
                            <cbc:AddressTypeCode listAgencyName="PE:SUNAT" listName="Establecimientos anexos">0000</cbc:AddressTypeCode>
                            <cbc:CityName><![CDATA[LAMBAYEQUE]]></cbc:CityName>
                            <cbc:CountrySubentity><![CDATA[LAMBAYEQUE]]></cbc:CountrySubentity>
                            <cbc:District><![CDATA[LAMBAYEQUE]]></cbc:District>
                            <cac:AddressLine>
                                <cbc:Line><![CDATA[8 DE OCTUBRE N 123 - LAMBAYEQUE - LAMBAYEQUE - LAMBAYEQUE]]></cbc:Line>
                            </cac:AddressLine>
                            <cac:Country>
                                <cbc:IdentificationCode listID="ISO 3166-1" listAgencyName="United Nations Economic Commission for Europe" listName="Country">PE</cbc:IdentificationCode>
                            </cac:Country>
                        </cac:RegistrationAddress>
                    </cac:PartyLegalEntity>
                    <cac:Contact>
                        <cbc:Name><![CDATA[]]></cbc:Name>
                    </cac:Contact>
                </cac:Party>
            </cac:AccountingSupplierParty>
            <cac:AccountingCustomerParty>
                <cac:Party>
                    <cac:PartyIdentification>
                        <cbc:ID schemeID="6" schemeName="Documento de Identidad" schemeAgencyName="PE:SUNAT" schemeURI="urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06">20605145648</cbc:ID>
                    </cac:PartyIdentification>
                    <cac:PartyName>
                        <cbc:Name><![CDATA[AGROINVERSIONES Y SERVICIOS AJINOR S.R.L. - AGROSERVIS AJINOR S.R.L.]]></cbc:Name>
                    </cac:PartyName>
                    <cac:PartyTaxScheme>
                        <cbc:RegistrationName><![CDATA[AGROINVERSIONES Y SERVICIOS AJINOR S.R.L. - AGROSERVIS AJINOR S.R.L.]]></cbc:RegistrationName>
                        <cbc:CompanyID schemeID="6" schemeName="SUNAT:Identificador de Documento de Identidad" schemeAgencyName="PE:SUNAT" schemeURI="urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06">20605145648</cbc:CompanyID>
                        <cac:TaxScheme>
                            <cbc:ID schemeID="6" schemeName="SUNAT:Identificador de Documento de Identidad" schemeAgencyName="PE:SUNAT" schemeURI="urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06">20605145648</cbc:ID>
                        </cac:TaxScheme>
                    </cac:PartyTaxScheme>
                    <cac:PartyLegalEntity>
                        <cbc:RegistrationName><![CDATA[AGROINVERSIONES Y SERVICIOS AJINOR S.R.L. - AGROSERVIS AJINOR S.R.L.]]></cbc:RegistrationName>
                        <cac:RegistrationAddress>
                            <cbc:ID schemeName="Ubigeos" schemeAgencyName="PE:INEI"/>
                            <cbc:CityName><![CDATA[]]></cbc:CityName>
                            <cbc:CountrySubentity><![CDATA[]]></cbc:CountrySubentity>
                            <cbc:District><![CDATA[]]></cbc:District>
                            <cac:AddressLine>
                                <cbc:Line><![CDATA[MZA. C LOTE. 46 URB. SAN ISIDRO LA LIBERTAD - TRUJILLO - TRUJILLO]]></cbc:Line>
                            </cac:AddressLine>                                        
                            <cac:Country>
                                <cbc:IdentificationCode listID="ISO 3166-1" listAgencyName="United Nations Economic Commission for Europe" listName="Country"/>
                            </cac:Country>
                        </cac:RegistrationAddress>
                    </cac:PartyLegalEntity>
                </cac:Party>
            </cac:AccountingCustomerParty>
            <cac:PaymentTerms>
            <cbc:ID>FormaPago</cbc:ID>
            <cbc:PaymentMeansID>Contado</cbc:PaymentMeansID>
        </cac:PaymentTerms>  
            <cac:TaxTotal>
                <cbc:TaxAmount currencyID="PEN">28.22</cbc:TaxAmount>
                <cac:TaxSubtotal>
                    <cbc:TaxableAmount currencyID="PEN">156.78</cbc:TaxableAmount>
                    <cbc:TaxAmount currencyID="PEN">28.22</cbc:TaxAmount>
                    <cac:TaxCategory>
                        <cbc:ID schemeID="UN/ECE 5305" schemeName="Tax Category Identifier" schemeAgencyName="United Nations Economic Commission for Europe">S</cbc:ID>
                        <cac:TaxScheme>
                            <cbc:ID schemeID="UN/ECE 5153" schemeAgencyID="6">1000</cbc:ID>
                            <cbc:Name>IGV</cbc:Name>
                            <cbc:TaxTypeCode>VAT</cbc:TaxTypeCode>
                        </cac:TaxScheme>
                    </cac:TaxCategory>
                </cac:TaxSubtotal>          
            </cac:TaxTotal>
            <cac:LegalMonetaryTotal>
                <cbc:LineExtensionAmount currencyID="PEN">156.78</cbc:LineExtensionAmount>
                <cbc:TaxInclusiveAmount currencyID="PEN">185.00</cbc:TaxInclusiveAmount>
                <cbc:PayableAmount currencyID="PEN">185.00</cbc:PayableAmount>
            </cac:LegalMonetaryTotal>
            <cac:InvoiceLine>
                <cbc:ID>1</cbc:ID>
                <cbc:InvoicedQuantity unitCode="NIU" unitCodeListID="UN/ECE rec 20" unitCodeListAgencyName="United Nations Economic Commission for Europe">1</cbc:InvoicedQuantity>
                <cbc:LineExtensionAmount currencyID="PEN">156.78</cbc:LineExtensionAmount>
                <cac:PricingReference>
                    <cac:AlternativeConditionPrice>
                        <cbc:PriceAmount currencyID="PEN">185.00</cbc:PriceAmount>
                        <cbc:PriceTypeCode listName="Tipo de Precio" listAgencyName="PE:SUNAT" listURI="urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16">01</cbc:PriceTypeCode>
                    </cac:AlternativeConditionPrice>
                </cac:PricingReference>
                <cac:TaxTotal>
                    <cbc:TaxAmount currencyID="PEN">28.22</cbc:TaxAmount>
                    <cac:TaxSubtotal>
                        <cbc:TaxableAmount currencyID="PEN">156.78</cbc:TaxableAmount>
                        <cbc:TaxAmount currencyID="PEN">28.22</cbc:TaxAmount>
                        <cac:TaxCategory>
                            <cbc:ID schemeID="UN/ECE 5305" schemeName="Tax Category Identifier" schemeAgencyName="United Nations Economic Commission for Europe">S</cbc:ID>
                            <cbc:Percent>18</cbc:Percent>
                            <cbc:TaxExemptionReasonCode listAgencyName="PE:SUNAT" listName="Afectacion del IGV" listURI="urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07">10</cbc:TaxExemptionReasonCode>
                            <cac:TaxScheme>
                                <cbc:ID schemeID="UN/ECE 5153" schemeName="Codigo de tributos" schemeAgencyName="PE:SUNAT">1000</cbc:ID>
                                <cbc:Name>IGV</cbc:Name>
                                <cbc:TaxTypeCode>VAT</cbc:TaxTypeCode>
                            </cac:TaxScheme>
                        </cac:TaxCategory>
                    </cac:TaxSubtotal></cac:TaxTotal>
                <cac:Item>
                    <cbc:Description><![CDATA[FENA X L]]></cbc:Description>
                    <cac:SellersItemIdentification>
                        <cbc:ID><![CDATA[195]]></cbc:ID>
                    </cac:SellersItemIdentification>
                    <cac:CommodityClassification>
                        <cbc:ItemClassificationCode listID="UNSPSC" listAgencyName="GS1 US" listName="Item Classification">10191509</cbc:ItemClassificationCode>
                    </cac:CommodityClassification>
                </cac:Item>
                <cac:Price>
                    <cbc:PriceAmount currencyID="PEN">156.78</cbc:PriceAmount>
                </cac:Price>
            </cac:InvoiceLine>
        </Invoice>
        `
    try {

        //1. Generar XML
        await fs.writeFile(
            path.join(XML_FOLDER, `${nombreXml}.xml`),
            xml
        );
        console.log('XML generado correctamente');
        
        //2. Firmar XML
        const xmlSignature = new XmlSignature(
            path.join(__dirname, 'certificado', 'certificado-firma.pfx'),
            'neotest7159',
            await fs.readFile(
                path.join(XML_FOLDER, `${nombreXml}.xml`),
                'utf-8'
            )
        );

        const xmlFirmado = await xmlSignature.getSignedXML();
        
        
        await fs.writeFile(
            path.join(XML_FIRMADO_FOLDER, `${nombreXml}.xml`),
            xmlFirmado
        );

        console.log('XML firmado correctamente');

        //3. Generar ZIP
        const jszip = new JSZip();
        jszip.file(
            `${nombreXml}.xml`,
            await fs.readFile(
                path.join(XML_FIRMADO_FOLDER, `${nombreXml}.xml`),
                'utf-8'
            )
        );

        const xmlComprimido = await jszip.generateAsync({type: 'nodebuffer'});
        await fs.writeFile(
            path.join(ZIP_FOLDER, `${nombreXml}.zip`),
            xmlComprimido
        );
        console.log('Zip se ha generado correctamente con el nombre ', `${nombreXml}.zip`)


        //4. Enviar a SUNAT

        const xmlFirmadoComprimido = await fs.readFile(
            path.join(ZIP_FOLDER, `${nombreXml}.zip`),
            'base64'
        );


        const xmlBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.sunat.gob.pe" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext1.0.xsd"><soapenv:Header><wsse:Security><wsse:UsernameToken><wsse:Username>${datosEmisor.ruc}${datosEmisor.usuarioEmisor}</wsse:Username><wsse:Password>${datosEmisor.claveEmisor}</wsse:Password></wsse:UsernameToken></wsse:Security></soapenv:Header><soapenv:Body><ser:sendBill><fileName>${nombreXml}.zip</fileName><contentFile>${xmlFirmadoComprimido}</contentFile></ser:sendBill></soapenv:Body></soapenv:Envelope>`

        const wsURL = "https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService";

        const headers = {
            'Content-Type': 'text/xml; charset="utf-8"',
            'Accept': 'text/xml',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'SOAPAction': "",
            'Content-Length': Buffer.byteLength(xmlBody)
        };

        const response = await fetch(wsURL, {
            method: 'POST',
            headers,
            body: xmlBody
        });

        if(!response.ok) throw new Error('Ocurrio un error al enviar los datos: ', response.status);

        const xmlText = await response.text();

        const xmlResponse = new DOMParser().parseFromString(xmlText, 'text/xml');

        const applicationResponse = xmlResponse.getElementsByTagName("applicationResponse")[0];

        if(applicationResponse){

            const cdrBase64 = Buffer.from(applicationResponse.textContent, 'base64');
            await fs.writeFile(
                path.join(CDR_FOLDER, `${nombreXml}.zip`),
                cdrBase64
            );

            console.log('CDR recepcionado correctamente');

        }else{

            const codigo = xmlResponse.getElementsByTagName("faultcode")[0].textContent;
            const mensaje = xmlResponse.getElementsByTagName("faultstring")[0].textContent;
            throw new Error('Error con código ', codigo, ", ", mensaje);
        }


        //5. Lectura CDR
        const directorio = await unzipper.Open.file(
            path.join(CDR_FOLDER, `${nombreXml}.zip`)
        );

        await fs.mkdir(
            path.join(CDR_FOLDER, `R-${nombreXml}`),
        )

        await directorio.extract({
            path: path.join(CDR_FOLDER, `R-${nombreXml}`)
        });

        const xmlCDR = await fs.readFile(
            path.join(CDR_FOLDER, `R-${nombreXml}`, `R-${nombreXml}.xml`),
            'utf-8'
        )

        const contenidoXml = new DOMParser().parseFromString(xmlCDR, 'text/xml');

        const codigo = contenidoXml.getElementsByTagName('cbc:ResponseCode')[0].textContent;
        const mensaje = contenidoXml.getElementsByTagName('cbc:Description')[0].textContent;

        if(codigo === '0'){
            console.log(mensaje);
        }else{
            console.error(`Error - Codigo: ${codigo}, mensaje: ${mensaje}`);
        }

        
    } catch (error) {

        console.error('Error: ', error);
        
    }



}

enviarComprobante();



