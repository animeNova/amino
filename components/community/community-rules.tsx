import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface CommunityRulesProps {
  rules: {
    title: string
    description: string
  }[]
}

export function CommunityRules({ rules }: CommunityRulesProps) {
  return (
    <Card>
      <CardHeader>
        <h4 className="text-sm font-medium">Community Rules</h4>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div key={index} className="space-y-2">
              <div className="font-medium">
                {index + 1}. {rule.title}
              </div>
              <p className="text-sm text-muted-foreground">{rule.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

