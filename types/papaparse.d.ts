declare module "papaparse" {
	export interface ParseResult<T> {
		data: T[];
		errors: { row: number; type: string; code: string; message: string }[];
		meta: {
			delimiter: string;
			linebreak: string;
			aborted: boolean;
			truncated: boolean;
			cursor: number;
		};
	}

	export interface ParseConfig {
		header?: boolean;
		skipEmptyLines?: boolean;
		complete?: (results: ParseResult<any>) => void;
		error?: (error: Error) => void;
		[key: string]: any;
	}

	export function parse<T>(file: File | string, config: ParseConfig): void;

	export default {
		parse,
	};
}
