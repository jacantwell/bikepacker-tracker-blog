import { formatDate } from '../../lib/dates';

type Props = {
  dateString: string;
};

const DateFormatter = ({ dateString }: Props) => {
  return <time dateTime={dateString}>{formatDate(dateString)}</time>;
};

export default DateFormatter;