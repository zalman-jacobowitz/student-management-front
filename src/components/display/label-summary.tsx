import { Label } from "src/components/label";

interface LabelSummaryItem {
  label: string;
  color: string;
  icon: string;
  sum: (data: any[]) => number;
}

interface LabelSummaryProps {
  labels_summary?: LabelSummaryItem[];
  data?: any[];
}


export function LabelSummary({labels_summary=[], data=[]}: LabelSummaryProps) {

    return (
      <>
      {
        labels_summary.map((item, index) => (
          // @ts-expect-error Label is not typed now
        <Label
          key={index} 
          color={item.color} 
          sx={{ textTransform: 'capitalize', ml: 1 }}
          data-testid={`${item.label.toLowerCase()}-count`}
        >
          {item.sum(data)} {item.label}
        </Label>
        ))
        }
      </>
    );
  }