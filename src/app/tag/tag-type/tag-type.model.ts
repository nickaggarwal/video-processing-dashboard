import { Tag } from "app/tag/tag.model";

export interface TagType {
    status:       string;
    createdAt:    number;
    modifiedAt:   number;
    id:           number;
    name:         string;
    description:  string;
    displayName?: string;
    displayOrder: number;
}

export interface TagInfo {
    tagType: TagType;
    tags: Tag[];
}

export interface RelatedTag {
    tagDto: Tag;
    relTagId: number;
}

export interface RelatedTagInfo {
    sourceTag: RelatedTag;
    destTags: RelatedTag[];
}