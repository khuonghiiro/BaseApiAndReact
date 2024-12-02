import useSWR from 'swr';
import { BaseService, useCustomSWR } from '@/shared/services';
import api from '@/shared/services/axios-custom';
import { Meta } from '@/shared/model';
class services extends BaseService {
	GetList = (meta: Meta) => {
		const { data, error, isLoading, mutate } = useCustomSWR<any>([this.url, meta], () => this.getMany(meta));
		return {
			data,
			error,
			isLoading,
			mutate,
		};
	};
	GetById = (id: number) => {
		const { data, error, isLoading, mutate } = useCustomSWR<any>(id ? `${this.url}${id}` : null, () => api.get(`${this.url}/${id}`));
		return {
			data,
			error,
			isLoading,
			mutate,
		};
	};
	GetUser = () => {
		const { data, isLoading } = useCustomSWR<any>('api/user', () => api.get('api/user'));
		return {
			data: data?.data.map((item: any) => {
				return {
					value: item.id,
					label: item.title,
				};
			}),
			isLoading,
		};
	};
	GetUserAgree = () => {
		const { data, isLoading } = useCustomSWR<any>('api/user', () => api.get('api/user'));
		return {
			data: data?.data.map((item: any) => {
				return {
					value: item.id,
					label: item.title,
				};
			}),
			isLoading,
		};
	};

	updateStatus = async (id: number, status: number) => {
		const res: any = await api.put(`api/passwordresetrequest/update/${id}/${status}`);
		return res;
	  };

	getObjectAtIdAsync = async (id: any) => {
		const res: any = await api.get(`${this.url}/${id}`);
		return res;
	  };
}
const passwordResetRequestServices = new services("api/passwordresetrequest");
export { passwordResetRequestServices };
