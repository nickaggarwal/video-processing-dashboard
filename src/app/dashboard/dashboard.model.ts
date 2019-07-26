import { TagType } from "app/tag/tag-type/tag-type.model";
import { Tag } from "app/tag/tag.model";

export interface DashboardKpi {
    id: string;
    count: string;
}

export interface QuestionCountGroupedByTagTypeDto {
    tagType: TagType;
    quesCountByTags: QuestionCountGroupedByTagDto[];
}


export interface QuestionCountGroupedByTagDto {
    tag: Tag;
    quesCount: number;
}

export interface Lead {
    id: number;
    updated_at: string;
    created_at: string;
    first_name: string;
    last_name: string;
    mobile: string;
    email: string;
    location_type: string;
    location_string: string;
    status: string;
    communication: string;
    tags: string;
}
