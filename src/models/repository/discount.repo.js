import { getSelectData, getUnSelectData } from "../../utils/index.js";
import discount from "../discount.model.js";

export const checkDiscountExist = ({model, filter}) => {
    return model.findOne(filter)
}
export const findAllDiscountCodesUnselect = async ({ limit = 50, page = 1, sort = "ctime", filter, unSelect, model }) => {
    const skip = (page - 1) * page;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const documents = await model
        .find(filter)
        .limit(limit)
        .skip(skip)
        .sort(sortBy)
        .select(getUnSelectData(unSelect))
        .lean();
    return documents;
};

export const findAllDiscountCodesSelect = async ({ limit = 50, page = 1, sort = "ctime", filter, select, model }) => {
    const skip = (page - 1) * page;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const documents = await model
        .find(filter)
        .limit(limit)
        .skip(skip)
        .sort(sortBy)
        .select(getSelectData(select))
        .lean();
    return documents;
};