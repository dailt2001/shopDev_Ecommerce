import { htmlEmailToken } from '../utils/tem.html.js'
import Template from '../models/template.model.js'

export const newTemplate = async({ tem_name, tem_html = '' }) => {
    //check if tem exist

    // create new tem
    const newTem = await Template.create({
        tem_name,
        tem_html: htmlEmailToken()
    })

    return newTem
}

export const getTemplate = async({ tem_name }) => {
    return await Template.findOne({ tem_name })
}