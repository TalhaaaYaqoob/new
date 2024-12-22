'use client'

import * as React from 'react'
import { X, HelpCircle, ChevronRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface FilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const INDUSTRIES = {
  "Technology": {
    "Software & Services": [
      "Enterprise Software",
      "Cloud Computing",
      "Cybersecurity",
      "AI & Machine Learning",
      "Mobile Apps"
    ],
    "Hardware & Infrastructure": [
      "Semiconductors",
      "Networking Equipment",
      "IoT Devices",
      "Computer Hardware"
    ],
    "Digital Media": [
      "Digital Content",
      "Streaming Services",
      "Gaming",
      "Social Media"
    ]
  },
  "Healthcare": {
    "Medical Devices": [
      "Diagnostic Equipment",
      "Therapeutic Devices",
      "Monitoring Systems",
      "Medical Supplies"
    ],
    "Healthcare Services": [
      "Hospitals",
      "Clinics",
      "Telemedicine",
      "Healthcare IT"
    ],
    "Pharmaceuticals": [
      "Drug Development",
      "Biotech",
      "Clinical Research",
      "Generic Drugs"
    ]
  },
  "Financial Services": {
    "Banking": [
      "Retail Banking",
      "Commercial Banking",
      "Investment Banking",
      "Digital Banking"
    ],
    "Insurance": [
      "Life Insurance",
      "Health Insurance",
      "Property Insurance",
      "InsurTech"
    ],
    "Investment": [
      "Asset Management",
      "Wealth Management",
      "FinTech",
      "Cryptocurrency"
    ]
  },
  "Manufacturing": {
    "Industrial": [
      "Heavy Machinery",
      "Automation Systems",
      "Industrial Tools",
      "Manufacturing Equipment"
    ],
    "Consumer Goods": [
      "Electronics",
      "Appliances",
      "Furniture",
      "Textiles"
    ],
    "Automotive": [
      "Vehicle Manufacturing",
      "Auto Parts",
      "Electric Vehicles",
      "Autonomous Systems"
    ]
  },
  "Retail & E-commerce": {
    "Online Retail": [
      "E-commerce Platforms",
      "Digital Marketplaces",
      "Direct-to-Consumer",
      "Subscription Services"
    ],
    "Traditional Retail": [
      "Department Stores",
      "Specialty Retail",
      "Grocery",
      "Fashion Retail"
    ],
    "Omnichannel": [
      "Multi-channel Retail",
      "Retail Technology",
      "Inventory Management",
      "Point of Sale Systems"
    ]
  }
}

export function EnhancedFilterDialog({ open, onOpenChange }: FilterDialogProps) {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = React.useState<string[]>([])
  const [selectedSpecialties, setSelectedSpecialties] = React.useState<string[]>([])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        // Remove category and all its subcategories and specialties
        const newCategories = prev.filter(c => c !== category)
        const subcategories = Object.keys(INDUSTRIES[category as keyof typeof INDUSTRIES])
        setSelectedSubcategories(prev => prev.filter(sub => !subcategories.includes(sub)))
        const specialties = subcategories.flatMap(sub => INDUSTRIES[category as keyof typeof INDUSTRIES][sub])
        setSelectedSpecialties(prev => prev.filter(spec => !specialties.includes(spec)))
        return newCategories
      }
      return [...prev, category]
    })
  }

  const handleSubcategoryChange = (category: string, subcategory: string) => {
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategory)) {
        // Remove subcategory and all its specialties
        const newSubcategories = prev.filter(sub => sub !== subcategory)
        const specialties = INDUSTRIES[category as keyof typeof INDUSTRIES][subcategory]
        setSelectedSpecialties(prev => prev.filter(spec => !specialties.includes(spec)))
        return newSubcategories
      }
      return [...prev, subcategory]
    })
  }

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(spec => spec !== specialty)
        : [...prev, specialty]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Filter by Industry</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-grow mt-4 h-[60vh] pr-4">
          <div className="space-y-6">
            {Object.entries(INDUSTRIES).map(([category, subcategories]) => (
              <Collapsible key={category}>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                    id={category}
                  />
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <Label htmlFor={category} className="text-lg font-semibold cursor-pointer">
                      {category}
                    </Label>
                    <ChevronRight className="h-4 w-4" />
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="pl-6 space-y-4">
                  {Object.entries(subcategories).map(([subcategory, specialties]) => (
                    <Collapsible key={subcategory}>
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          checked={selectedSubcategories.includes(subcategory)}
                          onCheckedChange={() => handleSubcategoryChange(category, subcategory)}
                          id={subcategory}
                        />
                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                          <Label htmlFor={subcategory} className="text-base font-medium cursor-pointer">
                            {subcategory}
                          </Label>
                          <ChevronRight className="h-4 w-4" />
                        </CollapsibleTrigger>
                      </div>

                      <CollapsibleContent className="pl-6 space-y-2">
                        {specialties.map((specialty) => (
                          <div key={specialty} className="flex items-center space-x-2">
                            <Checkbox
                              checked={selectedSpecialties.includes(specialty)}
                              onCheckedChange={() => handleSpecialtyChange(specialty)}
                              id={specialty}
                            />
                            <Label htmlFor={specialty} className="text-sm cursor-pointer">
                              {specialty}
                            </Label>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => {
            setSelectedCategories([])
            setSelectedSubcategories([])
            setSelectedSpecialties([])
          }}>
            Reset
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

