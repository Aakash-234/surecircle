import pandas as pd
import plotly.graph_objects as go

# Create the data from the provided JSON
data = {
    "Factor": ["Payment Consistency","Claims Behavior","Community Participation","Verification Status","Social Factors"], 
    "Weight": [35,25,20,10,10]
}

df = pd.DataFrame(data)

# Abbreviate factor names to meet 15 character limit
df['Factor_Short'] = ["Payment Consist", "Claims Behavior", "Community Part", "Verification", "Social Factors"]

# Create donut chart
fig = go.Figure(data=[go.Pie(
    labels=df['Factor_Short'], 
    values=df['Weight'],
    hole=0.4,  # This makes it a donut chart
    textinfo='percent',
    textposition='inside'
)])

# Set the specific colors requested
colors = ['#21808D', '#FF9933', '#4C9BD5', '#8E44AD', '#F1C40F']
fig.update_traces(marker=dict(colors=colors))

# Update layout following pie chart instructions
fig.update_layout(
    title="SureScore Trust Score Weighting",
    uniformtext_minsize=14, 
    uniformtext_mode='hide'
)

# Save the chart
fig.write_image("surescore_donut_chart.png")