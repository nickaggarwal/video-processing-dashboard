import { TagType } from "app/tag/tag-type/tag-type.model";

export interface Tag {
    status:       string;
    createdBy:    string;
    createdAt:    number;
    modifiedBy:   string;
    modifiedAt:   number;
    id:           number;
    name:         string;
    description:  string;
    displayName?: string;
    displayOrder: number;
    imageUrl:     string;
    tagType?:     TagType;
    parentId?:    string;
    children?:    Tag[];
}